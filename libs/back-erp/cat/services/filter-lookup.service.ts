import { Injectable } from '@nestjs/common'
import { FilterValuesConnectedUtils } from '@app/back/cat/utils/filter-values-connected.utils'
import { CatFilterValue } from '@app/back/cat/entities/filter-value.entity'
import { CatFilter } from '@app/back/cat/entities/filter.entity'
import { FilterLookupInfo, FilterLookupInfoItem } from '@app/back/cat/types/erp/filter-lookup.types'

@Injectable()
export class FilterLookupService {
  initialized = false
  connectedIds: Record<number, number[]> = {}
  values: Record<number, CatFilterValue> = {}
  filters: Record<number, CatFilter> = {}

  async init() {
    await this.loadFiltersAndValues()
    await this.loadConnectedIds()
    this.initialized = true
  }

  async loadConnectedIds() {
    this.connectedIds = {}
    const allConnectedIds = await FilterValuesConnectedUtils.getAllConnectedIds()
    allConnectedIds.forEach( e => {
      if ( !this.connectedIds[ e.id1 ] ) {
        this.connectedIds[ e.id1 ] = []
      }
      this.connectedIds[ e.id1 ].push( e.id2 )
    } )
  }

  async loadFiltersAndValues() {
    this.filters = {}
    this.values = {}
    const f = await CatFilter.findAll( {raw: true} )
    f.forEach( el => this.filters[ el.id ] = el )
    const fv = await CatFilterValue.findAll( {raw: true} )
    fv.forEach( el => this.values[ el.id ] = el )
  }

  async getLookupInfo( ids: number[] ): Promise<FilterLookupInfo> {
    if ( !this.initialized ) {
      await this.init()
    }

    const res: FilterLookupInfo = {
      ids,
      standard: {},
      common: {},
      others: [],
    }

    for ( const id of ids ) {
      if ( !this.values[ id ] ) {
        await this.init()
      }
      const value = this.values[ id ]
      if ( !value ) {
        continue
      }
      const filter = this.filters[ value.filterId ]
      if ( !filter ) {
        continue
      }

      if ( filter.type ) {
        if ( !res.standard[ filter.type ] ) {
          res.standard[ filter.type ] = {id: filter.id, name: filter.name, values: []}
        }

        const itemConnectedIds: number[] = []

        if ( !res.standard[ filter.type ].values.find( e => e.id === id ) ) {
          res.standard[ filter.type ].values.push( {
            id,
            name: value.name,
            doNotConnectToCommon: value.doNotConnectToCommon || undefined,
            connectedIds: this.connectedIds[ id ],
          } )
          this.connectedIds[ id ]?.forEach( i => {
            if ( !itemConnectedIds.find( e => e === i ) ) {
              itemConnectedIds.push( i )
            }
          } )
        }

        for ( const connectedId of itemConnectedIds ) {
          const connectedValue = this.values[ connectedId ]
          if ( !connectedValue ) {
            continue
          }
          const connectedFilter = this.filters[ connectedValue.filterId ]
          if ( !connectedFilter ) {
            continue
          }

          if ( !res.common[ connectedFilter.type ] ) {
            res.common[ connectedFilter.type ] = {id: connectedFilter.id, name: connectedFilter.name, values: []}
          }

          if ( !res.common[ connectedFilter.type ].values.find( e => e.id === connectedId ) ) {
            res.common[ connectedFilter.type ].values.push( {
              id: connectedId,
              name: connectedValue.name,
              doNotConnectToCommon: connectedValue.doNotConnectToCommon || undefined,
            } )
          }
        }
      } else {
        let f: FilterLookupInfoItem = res.others.find( e => e.id === filter.id )
        if ( !f ) {
          f = {id: filter.id, name: filter.name, values: []}
        }
        res.others.push( f )

        f.values.push( {
          id,
          name: value.name,
          doNotConnectToCommon: value.doNotConnectToCommon || undefined,
        } )
      }
    }
    return res
  }

}
