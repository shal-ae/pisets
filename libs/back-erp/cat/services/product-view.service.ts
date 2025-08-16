import { Injectable } from '@nestjs/common'
import { FilterLookupService } from './filter-lookup.service'
import { CategoryLookupService } from './category-lookup.service'
import { ProductViewQuery, ProductViewResult } from '@app/back/cat/types/erp/product-view.types'
import { CacheUtils } from '@app/back/utils/cache.utils'
import { CacheProduct, CacheStockAndPrices } from '@app/back/cat/entities/cache/cache-product'
import { CatProduct } from '@app/back/cat/entities/product.entity'
import { SpecificationLookupService } from '@app/back/cat/services/specification-lookup.service'
import { CatProductType } from '@app/back/cat/types/product.types'

@Injectable()
export class ProductViewService {
  constructor( private filterLookupService: FilterLookupService,
               private categoryLookupService: CategoryLookupService,
               private specificationLookupService: SpecificationLookupService,
  ) {
  }

  async queryProducts( query: ProductViewQuery ): Promise<ProductViewResult> {
    const res: ProductViewResult = {}
    if ( query.includeAllColors ) {
      const r = await CatProduct.findAll( {
        where: {id: query.productAndStockIds},
        raw: true,
        order: [ 'parentId', 'sortIndex', 'id' ],
        attributes: [ 'id', 'parentId', 'type' ],
      } )
      const groupIds: number[] = []
      r.forEach( productOrGroup => {
        if ( productOrGroup.type === CatProductType.group ) {
          if ( groupIds.findIndex( id => id === productOrGroup.id ) === -1 ) {
            groupIds.push( productOrGroup.id )
          }
        }
        if ( productOrGroup.type === CatProductType.product || productOrGroup.type === CatProductType.productWithSizes ) {
          if ( productOrGroup.parentId && groupIds.findIndex( id => id === productOrGroup.parentId ) === -1 ) {
            groupIds.push( productOrGroup.parentId )
          }
        }
      } )

      if ( groupIds.length ) {
        query.groupIds = groupIds
      }
    }

    if ( query.groupIds?.length ) {
      const r = await CatProduct.findAll( {
        where: {parentId: query.groupIds},
        raw: true,
        order: [ 'parentId', 'sortIndex', 'id' ],
        attributes: [ 'id' ],
      } )
      query.productAndStockIds = r.map( e => e.id )
      query.lookups = {}
      query.lookups.filtersForProducts = query.productAndStockIds
      query.lookups.categoriesForProducts = query.productAndStockIds
      query.lookups.specificationsForProducts = query.productAndStockIds
      query.lookups.groupViewsForProducts = query.productAndStockIds
    }
    if ( query.productAndStockIds?.length ) {
      query.products = query.productAndStockIds.map( id => ( {id} ) )
      query.stocks = query.productAndStockIds.map( id => ( {id} ) )
    }

    if ( query.products?.length ) {
      res.products = await CacheUtils.getItems( CacheProduct, query.products )
    }
    if ( query.stocks?.length ) {
      res.stocks = await CacheUtils.getItems( CacheStockAndPrices, query.stocks )
    }
    if ( query.lookups ) {
      res.lookups = {}
      if ( query.lookups.groupViewsForProducts?.length ) {
        res.lookups.groups = {}
        const groupIds: number[] = []
        res.products.forEach( e => {
          if ( ( e.data?.type === CatProductType.product || e.data?.type === CatProductType.productWithSizes ) && e.data?.parentId ) {
            if ( groupIds.indexOf( e.data.parentId ) === -1 ) {
              groupIds.push( e.data.parentId )
            }
          }
        } )
        if ( groupIds.length ) {
          const q = await CatProduct.findAll( {
            where: {id: groupIds, type: CatProductType.group},
            attributes: [ 'id', 'catalogId', 'type', 'name', 'article', 'stopped' ], raw: true,
          } )
          q.forEach( d => {
            res.lookups.groups[ d.id ] = {...d, stopped: d.stopped || undefined}
          } )
        }
      }

      if ( query.lookups.filtersForProducts?.length ) {
        res.lookups.filters = {}
        for ( const productId of query.lookups.filtersForProducts ) {
          const p = res.products.find( e => e.id === productId )
          if ( !p?.data?.filterIds ) {
            continue
          }
          res.lookups.filters[ productId ] = await this.filterLookupService.getLookupInfo( p.data.filterIds )
        }
      }

      if ( query.lookups.categoriesForProducts?.length ) {
        res.lookups.categories = {}
        for ( const productId of query.lookups.categoriesForProducts ) {
          const p = res.products.find( e => e.id === productId )
          if ( !p?.data?.categoryIds ) {
            continue
          }
          res.lookups.categories[ productId ] = await this.categoryLookupService.getLookupInfo( p.data.categoryIds )
        }
      }

      if ( query.lookups.specificationsForProducts?.length ) {
        res.lookups.specifications = {}
        for ( const productId of query.lookups.specificationsForProducts ) {
          const p = res.products.find( e => e.id === productId )
          const specIds = p?.data?.specs.map( e => e.specId )
          if ( !specIds ) {
            continue
          }
          res.lookups.specifications[ productId ] = await this.specificationLookupService.getLookupInfo( specIds )
        }
      }
    }
    return res

  }
}
