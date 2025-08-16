import { CatFilterValue } from '../entities/filter-value.entity'
import { CatFilter } from '../entities/filter.entity'
import { CatCatalog } from '../entities/catalog.entity'
import { QueryTypes } from 'sequelize'
import { AllFilterValuesStat, FiltersStat, NotConnectedFilterInfo } from '../types/statistic.types'
import { SetSortDTO } from '../dto/catalog.dto'
import { FilterValuesConnectedUtils } from '@app/back/cat/utils/filter-values-connected.utils'
import { FilterUtils } from '@app/back/cat/utils/filter.utils'
import { Sequelize } from 'sequelize-typescript'
import { MyUtils } from '@app/back/utils/my-utils'

export class FilterValuesUtils {

  static async setFilterValueSort( data: SetSortDTO ): Promise<void> {
    const fv = await CatFilterValue.findByPk( data.id )
    if ( !fv ) {
      return
    }
    fv.sortIndex = data.sortIndex
    await fv.save()
  }

  static async getFilterValuesWithConnected( filterId: number ): Promise<CatFilterValue[]> {
    const allConnectedIds = await FilterValuesConnectedUtils.getAllConnectedIds()
    const filterValues: CatFilterValue[] = await this.getFilterValues( filterId )
    filterValues.forEach( e => {
      e.setDataValue( 'connectedIds', FilterValuesConnectedUtils.getConnectedIds( e.id, allConnectedIds ) )
      e.setDataValue( 'outdated', !!e.outdated )
    } )
    return filterValues
  }

  static async deleteFilterValues( ids: number[] ): Promise<number> {
    await FilterValuesConnectedUtils.disconnectAllFromIds( ids )
    return CatFilterValue.destroy( {where: {id: ids}} )
  }

  static async addOrUpdateFilterValues( sequelize: Sequelize, filterId: number, filterValues: Partial<CatFilterValue>[] ): Promise<CatFilterValue[]> {
    const filter = await CatFilter.findByPk( filterId )
    const catalog = await CatCatalog.findByPk( filter.catalogId )

    const res: CatFilterValue[] = []
    for ( const data of filterValues ) {
      if ( data.id ) {

        const filterValue = await CatFilterValue.findByPk( data.id )
        filterValue.set( data )
        // Utils.fillFields( filterValue, data, [ 'name', 'catalogCode', 'sortIndex', 'doNotConnectToCommon' ] )
        if ( data.doNotConnectToCommon ) {
          await FilterValuesConnectedUtils.disconnectAllFrom( data.id )
        }
        const fv = await filterValue.save()
        if ( data.connectTo ) {
          await FilterValuesConnectedUtils.setFilterValueConnection( true, data.connectTo, filterValue.id )
        }
        res.push( fv )
      } else {
        const filterValue = CatFilterValue.build()
        filterValue.filterId = filter.id
        filterValue.catalogId = catalog.id
        filterValue.name = data.name
        filterValue.catalogCode = data.catalogCode || MyUtils.sha1( data.name )
        filterValue.outdated = false
        filterValue.outdatedForLoading = false
        filterValue.sortIndex = data.sortIndex > 0 ? data.sortIndex : await this.getMaximumSortIndex( sequelize, filter.id ) + 1
        filterValue.doNotConnectToCommon = data.doNotConnectToCommon
        filterValue.icon = data.icon
        res.push( await filterValue.save() )
        if ( data.connectTo ) {
          await FilterValuesConnectedUtils.setFilterValueConnection( true, data.connectTo, filterValue.id )
        }
      }
    }

    return res
  }

  static async getMaximumSortIndex( sequelize: Sequelize, filterId: number ): Promise<number> {
    const r = await sequelize.query<{ sortIndex: number }>( `
        SELECT MAX("sortIndex") AS "sortIndex"
        from cat__filter_value
        WHERE "filterId" = :filterId`, {
      replacements: {
        filterId,
      },
      type: QueryTypes.SELECT,
    } )
    return r[ 0 ]?.sortIndex || 0
  }


  static async getFilterValues( filterId: number ): Promise<CatFilterValue[]> {
    return CatFilterValue.findAll( {where: {filterId}, order: [ 'sortIndex', 'id' ]} )
  }


  static async getAllFilterValuesStat( sequelize: Sequelize ): Promise<AllFilterValuesStat> {
    const notConnectedInfo: NotConnectedFilterInfo[] = await FilterValuesConnectedUtils.getNotConnectedInfo( sequelize )
    const res: AllFilterValuesStat = {}
    const catalogs = await CatCatalog.findAll()
    for ( const catalog of catalogs ) {
      const stat = await this.getCatalogFiltersStat( sequelize, catalog.id, notConnectedInfo )
      res[ catalog.id ] = stat
    }
    return res
  }

  static async getCatalogFiltersStat( sequelize: Sequelize, catalogId: number, notConnectedInfo: NotConnectedFilterInfo[] ): Promise<FiltersStat[]> {
    const res: FiltersStat[] = []
    const filters = ( await FilterUtils.getAll() ).filter( e => e.catalogId === catalogId ).filter( e => e.type )
    for ( const filter of filters ) {
      res.push( await this.getStat( sequelize, filter, notConnectedInfo ) )
    }
    return res
  }

  static async getStat( sequelize: Sequelize, filter: CatFilter, notConnectedInfo: NotConnectedFilterInfo[] ): Promise<FiltersStat> {

    const valuesToConnectCount = notConnectedInfo.find( e => e.id === filter.id )?.cnt || 0

    const res: FiltersStat = {
      filterId: filter.id,
      type: filter.type,
      valuesCount: 0,
      ignoreValuesCount: 0,
      valuesToConnectCount,
    }

    const r1 = await sequelize.query<{ cnt: number }>( `SELECT COUNT(id) as cnt
                                                        FROM cat__filter_value
                                                        WHERE "filterId" = :filterId
                                                          and NOT outdated`, {
      replacements: {
        filterId: filter.id,
      },
      type: QueryTypes.SELECT,
    } )

    res.valuesCount = +r1[ 0 ].cnt

    const r2 = await sequelize.query<{ cnt: number }>( `SELECT COUNT(id) as cnt
                                                        FROM cat__filter_value
                                                        WHERE "filterId" = :filterId
                                                          and NOT outdated
                                                          and "doNotConnectToCommon"`, {
      replacements: {
        filterId: filter.id,
      },
      type: QueryTypes.SELECT,
    } )

    res.ignoreValuesCount = +r2[ 0 ].cnt


    const fv = await this.getFilterValuesWithConnected( filter.id )
    fv.forEach( ( filterValue: CatFilterValue ) => {
      if ( !filterValue.doNotConnectToCommon && !filterValue.get( 'connectedIds' ).length ) {
        res.valuesToConnectCount++
      }
    } )
    return res
  }


}
