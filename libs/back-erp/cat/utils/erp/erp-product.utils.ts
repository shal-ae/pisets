import { CatProduct } from '@app/back/cat/entities/product.entity'
import {
  ProductGroupErpDTO,
  ProductProductErpDTO,
  ProductSizeErpDTO,
  ProductSpecificationErpDTO,
} from '@app/back/cat/dto/erp/product-erp.dto'
import { CatProductType } from '@app/back/cat/types/product.types'
import { QueryTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { CacheUtils } from '@app/back/utils/cache.utils'
import { CacheProduct } from '@app/back/cat/entities/cache/cache-product'

export class ErpProductUtils {

  static groupToProductGroupErpDto( product: CatProduct ): ProductGroupErpDTO {
    return {
      id: product.id,
      catalogId: product.catalogId,
      type: product.type,
      name: product.name,
      article: product.article,
      stopped: product.stopped || undefined,
      catalogCode: product.catalogCode || undefined,
    }
  }

  static async productToProductProductErpDto( sequelize: Sequelize, product: CatProduct, saveCache = false ): Promise<ProductProductErpDTO> {
    if ( !saveCache ) {
      return this.calculateProductErpDto( sequelize, product )
    }

    /** У выбывших продуктов данные вложенных таблиц очищены,
     *  поэтому кэш оставляем, только изменяем поле stopped
     * */
    let res = null
    if ( product.stopped ) {
      const cached = await CacheUtils.getData( CacheProduct, product.id )
      if ( cached ) {
        cached.stopped = true
        res = cached
      }
    }
    if ( !res ) {
      res = await this.calculateProductErpDto( sequelize, product )
    }
    await CacheUtils.saveData( CacheProduct, res.id, res )

    return res
  }

  static async calculateProductErpDto( sequelize: Sequelize, product: CatProduct ): Promise<ProductProductErpDTO> {
    const res: ProductProductErpDTO = {
      id: product.id,
      catalogId: product.catalogId,
      type: product.type,
      name: product.name,
      article: product.article,
      stopped: product.stopped || undefined,
      parentId: product.parentId,
      catalogCode: product.catalogCode ?? undefined,
      size: product.size ?? undefined,
      description: product.description ?? undefined,
      pics: product.allDownloadedPictures?.split( ',' ) || [],
      filterIds: await this.getFiltersOfProduct( sequelize, product.id ),
      categoryIds: await this.getCategoriesOfProduct( sequelize, product.id ),
      specs: await this.getSpecificationsOfProduct( sequelize, product.id ),
    }
    if ( product.type === CatProductType.productWithSizes ) {
      res.productSizes = await this.getProductSizesDto( product.id )
    }
    return res
  }

  private static async getFiltersOfProduct( sequelize: Sequelize, productId: number ): Promise<number[]> {
    const res = await sequelize.query<{ filterValueId: number }>( `select "filterValueId"
                                                                   from cat__product_filter_value
                                                                   where "productId" = :productId
                                                                     and not outdated
                                                                   order by "filterId", "sortIndex", id`,
        {type: QueryTypes.SELECT, replacements: {productId}} )

    return res.map( e => e.filterValueId )
  }

  private static async getCategoriesOfProduct( sequelize: Sequelize, productId: number ): Promise<number[]> {
    const res = await sequelize.query<{ categoryId: number }>( `select "categoryId"
                                                                from cat__product_category
                                                                where "productId" = :productId
                                                                  and NOT outdated
                                                                order by "sortIndex", id`,
        {type: QueryTypes.SELECT, replacements: {productId}} )

    return res.map( e => e.categoryId )
  }

  private static async getSpecificationsOfProduct( sequelize: Sequelize, productId: number ): Promise<ProductSpecificationErpDTO[]> {
    const d = await sequelize.query<any>( `select id, "specificationId", "sortIndex", value, "valueForOffers"
                                           from cat__product_specification
                                           where "productId" = :productId
                                             and NOT outdated
                                           order by "sortIndex", id`,
        {type: QueryTypes.SELECT, replacements: {productId}} )

    return d.map( e => ( {
      specId: e.specificationId,
      sortIndex: e.sortIndex ?? undefined,
      value: e.value,
      valueForOffers: e.valueForOffers === e.value ? undefined : e.valueForOffers,
    } ) )
  }

  private static async getProductSizesDto( parentId: number ): Promise<ProductSizeErpDTO[]> {
    const sizes = await CatProduct.findAll( {
      where: {parentId, outdated: false},
      order: [ 'sortIndex', 'id' ],
    } )
    return sizes.map( e => ( {
          id: e.id,
          name: e.name,
          article: e.article,
          stopped: e.stopped || undefined,
          size: e.size,
          catalogCode: e.catalogCode,
        }
    ) )
  }


}
