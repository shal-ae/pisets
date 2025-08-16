import { Injectable } from '@nestjs/common'
import { CatCategory } from '@app/back/cat/entities/category.entity'
import { CategoryConnectedUtils } from '@app/back/cat/utils/category-connected.utils'
import { CategoryLookupInfo } from '@app/back/cat/types/erp/category-lookup.types'

@Injectable()
export class CategoryLookupService {
  initialized = false
  connectedIds: Record<number, number[]> = {}
  values: Record<number, CatCategory> = {}

  async init() {
    await this.loadCategories()
    await this.loadConnectedIds()
    this.initialized = true
  }

  async loadConnectedIds() {
    this.connectedIds = {}
    const allConnectedIds = await CategoryConnectedUtils.getAllConnectedIds()
    allConnectedIds.forEach( e => {
      if ( !this.connectedIds[ e.id1 ] ) {
        this.connectedIds[ e.id1 ] = []
      }
      this.connectedIds[ e.id1 ].push( e.id2 )
    } )
  }

  async loadCategories() {
    this.values = {}
    const fv = await CatCategory.findAll( {raw: true} )
    fv.forEach( el => this.values[ el.id ] = el )
  }

  async getLookupInfo( ids: number[] ): Promise<CategoryLookupInfo> {
    if ( !this.initialized ) {
      await this.init()
    }

    const res: CategoryLookupInfo = {
      ids,
      catalog: [],
      common: [],
    }

    for ( const id of ids ) {
      let value = this.values[ id ]
      if ( !value ) {
        await this.init()
        value = this.values[ id ]
      }
      if ( !value ) {
        continue
      }

      const itemConnectedIds: number[] = []
      let cat = res.catalog.find( el => el.id === id )
      if ( !cat ) {
        cat = {
          id,
          connectedIds: this.connectedIds[ id ],
          doNotConnectToCommon: value.doNotConnectToCommon || undefined,
          path: [],
        }
        res.catalog.push( cat )

        this.connectedIds[ id ]?.forEach( connectedId => {
          if ( !itemConnectedIds.find( e => e === connectedId ) ) {
            itemConnectedIds.push( connectedId )
          }
        } )

        let currentValue = {...value}
        while ( currentValue ) {
          cat.path.push( {
            id: currentValue.id,
            name: currentValue.name,
            parentId: currentValue.parentId,
          } )
          currentValue = this.values[ currentValue.parentId ]
        }
      }


      for ( const itemConnectedId of itemConnectedIds ) {
        let connectedValue = this.values[ itemConnectedId ]
        if ( !connectedValue ) {
          await this.init()
          connectedValue = this.values[ itemConnectedId ]
          if ( !connectedValue ) {
            continue
          }
        }

        let connectedCat = res.common.find( el => el.id === itemConnectedId )
        if ( !connectedCat ) {
          connectedCat = {
            id: itemConnectedId,
            path: [],
          }
          res.common.push( connectedCat )

          let currentConnectedValue = {...connectedValue}
          while ( currentConnectedValue ) {
            connectedCat.path.push( {
              id: currentConnectedValue.id,
              name: currentConnectedValue.name,
              parentId: currentConnectedValue.parentId,
            } )
            currentConnectedValue = this.values[ currentConnectedValue.parentId ]
          }
        }
      }
    }
    return res
  }

}
