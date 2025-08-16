import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@rka/db'
import { QueryTypes } from 'sequelize'
import { DbUtils } from '../../db/db-utils'
import { ListDTO, ListServiceFilterData } from './list.service.types'

@Injectable()
export class ListService<T, F extends ListServiceFilterData> {
  tableName = ''

  constructor( private db: DatabaseService ) {
  }

  async getIdList( filtersData: F ): Promise<ListDTO<number>> {
    const filterConditions = await this.getFilterConditions( filtersData )

    if ( filtersData.ids?.length ) {
      return { data: filtersData.ids, total: null }
    }

    const total = filtersData.countTotal === false ? null : await DbUtils.getTotal( this.db.sequelize, this.tableName, filterConditions )
    if ( total === 0 ) {
      return { data: [], total }
    }

    const offsetLimit = DbUtils.getOffsetAndLimitQueryFromFiltersData( filtersData )
    const orderByStr = filtersData.order ? ` ORDER BY ${filtersData.order}` : ''
    const q = `select id
               from ${this.tableName} ${filterConditions.length ? 'where ' : ''} ${filterConditions.join( ' AND ' )} ${orderByStr} ${offsetLimit}`


    const items = await this.db.sequelize.query<{ id: number }>( q, { type: QueryTypes.SELECT } )

    const data: number[] = items.map( e => e.id )

    return { data, total }
  }

  async getFilterConditions( filtersData ?: F ): Promise<string[]> {
    throw new Error( 'getFilterConditions is not implemented' )
  }

}
