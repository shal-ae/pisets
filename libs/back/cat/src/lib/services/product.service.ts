import {
  DEFAULT_PRODUCT_DTO,
  DEFAULT_PRODUCT_FILE_DTO,
  DEFAULT_PRODUCT_SPECIFICATION_DTO,
  ProductDTO,
  ProductFileDTO,
  ProductSpecificationDTO,
} from '@app/back/cat/dto/product.dto'
import { CatProductCategory } from '@app/back/cat/entities/product-category.entity'
import { CatProductFiles } from '@app/back/cat/entities/product-files.entity'
import { CatProductFilterValue } from '@app/back/cat/entities/product-filter-value.entity'
import { CatProductSpecification } from '@app/back/cat/entities/product-specification.entity'
import { CatProduct } from '@app/back/cat/entities/product.entity'
import { CatStockTemp } from '@app/back/cat/entities/stock-temp.entity'
import { CatProductType, getPriceDataFromDbFields, getStockDataFromDbFields } from '@app/back/cat/types/product.types'
import { MyUtils, Pair } from '@app/back/utils/my-utils'
import { StrUtils } from '@app/back/utils/str.utils'
import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@rka/db'
import { QueryTypes, Transaction } from 'sequelize'

@Injectable()
export class ProductService {

  constructor( private db: DatabaseService ) {
  }

  async connectedCategoryIds( ids: number[] ): Promise<number[]> {
    if ( !ids || !ids.length ) {
      return []
    }
    return (await this.db.sequelize.query<{ id2: number }>
      ( `select distinct "category2id" as id2
         from cat__category_connected
         where "category1id" in (:ids)`,
        { replacements: { ids }, type: QueryTypes.SELECT } )
    ).map( e => e.id2 )
  }

  async connectedFilterValueIds( ids?: number[] ): Promise<number[]> {
    if ( !ids || !ids.length ) {
      return []
    }
    return (await this.db.sequelize.query<{ id2: number }>
      ( `select distinct "filterValue2id" as id2
         from cat__filter_connected
         where "filterValue1id" in (:ids)`,
        { replacements: { ids }, type: QueryTypes.SELECT } )
    ).map( e => e.id2 )
  }

  async getProductDTO( ids: number[] ): Promise<ProductDTO[]> {
    if ( !ids.length ) {
      return []
    }
    const productSpecificationDTO: ProductSpecificationDTO[] = await this.getProductSpecificationDTO( ids )
    const filterValueIds: Pair<number, number>[] = await this.getFilterValueIds( ids )
    const categoryIds: Pair<number, number>[] = await this.getCategoryIds( ids )
    const childrenIds: Pair<number, number>[] = await this.getChildrenIds( ids )
    const productFileHashes: ProductFileDTO[] = await this.getProductFilesDTO( ids )

    const res: ProductDTO[] = []

    const products = await CatProduct.findAll( { where: { id: ids }, raw: true } )

    products.forEach( product => {
      const d: ProductDTO = {
        ...(product as unknown as ProductDTO),
        stock: getStockDataFromDbFields( product ),
        price: getPriceDataFromDbFields( product ),
        childrenIds: childrenIds.filter( e => e.id === product.id ).map( e => e.value ),
        filterValueIds: filterValueIds.filter( e => e.id === product.id ).map( e => e.value ),
        categoryIds: categoryIds.filter( e => e.id === product.id ).map( e => e.value ),
        specifications: productSpecificationDTO.filter( e => e.productId === product.id ),
        files: productFileHashes.filter( e => e.productId === product.id ),
      }

      MyUtils.deleteObjectFieldsNotExistingInAnotherObject( d, DEFAULT_PRODUCT_DTO )

      res.push( d )
    } )
    return res
  }

  async getOrCreateProductModel( catalogId: number, catalogCode: string, transaction?: Transaction ): Promise<CatProduct> {
    const [ res ] = await CatProduct.findOrCreate( {
      where: { catalogId, catalogCode },
      defaults: { outdated: false, outdatedForLoading: false },
      transaction,
    } )
    return res
  }

  async getOrCreateProductModelOfType( catalogId: number, catalogCode: string, type: CatProductType, transaction?: Transaction ): Promise<CatProduct> {
    const [ res ] = await CatProduct.findOrCreate( {
      where: { catalogId, catalogCode, type },
      defaults: { outdated: false, outdatedForLoading: false },
      transaction,
    } )
    return res
  }

  async isCatalogCodesUsedForProductTypeOfCatalog( catalogId: number, type: CatProductType ): Promise<boolean> {
    const res = await this.db.sequelize.query( `select id
                                                from cat__product
                                                where "catalogId" = :catalogId
                                                  and "catalogCode" IS NOT NULL
                                                  AND LENGTH("catalogCode") > 0
                                                  and type = :type LIMIT 1 `,
      { type: QueryTypes.SELECT, replacements: { catalogId, type } } )
    return res.length > 0
  }

//#region "Создание и поиск элементов по каталожным кодам вложенных элементов"
  async getProductGroupBySizesCatalogCodes( catalogId: number, sizeCatalogCodes: string[], transaction?: Transaction ): Promise<CatProduct | null> {
    const colorProductIds: number[] = await this.getParentIdsByCatalogCodes( catalogId, sizeCatalogCodes, [ CatProductType.size ], undefined, transaction )
    if ( !colorProductIds.length ) {
      return null
    }
    const groupProductIds: number[] = await this.getParentIdsByChildrenIds( colorProductIds, transaction )
    if ( !groupProductIds.length ) {
      return null
    }
    return CatProduct.findByPk( groupProductIds[ 0 ], { transaction } )
  }

  async getOrCreateProductGroupBySizesCatalogCodes( catalogId: number, sizeCatalogCodes: string[], transaction?: Transaction ): Promise<CatProduct> {
    const found = await this.getProductGroupBySizesCatalogCodes( catalogId, sizeCatalogCodes, transaction )
    if ( found ) {
      return found
    }
    return CatProduct.create(
      {
        catalogId,
        outdated: false,
        outdatedForLoading: false,
      },
      { transaction },
    )
  }

  async getProductColorBySizesCatalogCodes( catalogId: number, sizeCatalogCodes: string[], transaction?: Transaction ): Promise<CatProduct | null> {
    const colorProductIds: number[] = await this.getParentIdsByCatalogCodes( catalogId, sizeCatalogCodes, [ CatProductType.size ], undefined, transaction )
    if ( !colorProductIds.length ) {
      return null
    }
    return CatProduct.findByPk( colorProductIds[ 0 ], { transaction } )
  }

  async getOrCreateProductColorBySizesCatalogCodes( catalogId: number, sizeCatalogCodes: string[], transaction?: Transaction ): Promise<CatProduct> {
    const found = await this.getProductColorBySizesCatalogCodes( catalogId, sizeCatalogCodes, transaction )
    if ( found ) {
      return found
    }
    return CatProduct.create(
      {
        catalogId,
        outdated: false,
        outdatedForLoading: false,
      },
      { transaction },
    )
  }

  async getProductGroupByColorCatalogCodes( catalogId: number, colorCatalogCodes: string[], transaction?: Transaction ): Promise<CatProduct | null> {
    const parentProductIds: number[] = await this.getParentIdsByCatalogCodes( catalogId, colorCatalogCodes,
      [ CatProductType.product, CatProductType.productWithSizes ], undefined, transaction )
    if ( !parentProductIds.length ) {
      return null
    }
    return CatProduct.findByPk( parentProductIds[ 0 ], { transaction } )
  }

  async getOrCreateProductGroupByColorCatalogCodes( catalogId: number, colorCatalogCodes: string[], transaction?: Transaction ): Promise<CatProduct> {
    const found = await this.getProductGroupByColorCatalogCodes( catalogId, colorCatalogCodes, transaction )
    if ( found ) {
      return found
    }
    return CatProduct.create(
      {
        catalogId,
        outdated: false,
        outdatedForLoading: false,
      },
      { transaction },
    )
  }

  async getParentIdsByCatalogCodes( catalogId: number, catalogCodes: string[], childrenTypes: number[] = [], types: number[] = [], transaction?: Transaction ): Promise<number[]> {
    const res = await this.db.sequelize.query<{ id: number }>(
      `select distinct "parentId" as id
       from cat__product
       where "parentId" is not NULL
         AND "catalogId" = :catalogId
         AND "catalogCode" IN (:catalogCodes)
         AND (type IN (:childrenTypes) OR :emptyChildrenTypes)
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { catalogId, catalogCodes, childrenTypes, emptyChildrenTypes: !childrenTypes.length },
        transaction,
      } )
    const parentIds = res.map( e => e.id )
    if ( !types.length ) {
      return parentIds
    }
    const res2 = await this.db.sequelize.query<{ id: number }>(
      `select id
       from cat__product
       where id IN (:ids)
         AND (type IN (:types) OR :emptyTypes)
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { ids: parentIds, types, emptyTypes: !types.length },
        transaction,
      } )
    return res2.map( e => e.id )
  }

  async getParentIdsByChildrenIds( childrenIds: number[], transaction?: Transaction ): Promise<number[]> {
    const res = await this.db.sequelize.query<{ id: number }>(
      `select distinct "parentId" as id
       from cat__product
       where "parentId" is not NULL
         AND "id" IN (:childrenIds)
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { childrenIds },
        transaction,
      } )
    return res.map( e => e.id )
  }

//#endregion

  private async getProductSpecificationDTO( productIds: number[] ): Promise<ProductSpecificationDTO[]> {
    if ( !productIds.length ) {
      return []
    }
    const res: ProductSpecificationDTO[] = []
    const specifications = await CatProductSpecification.findAll( { where: { productId: productIds }, raw: true } )
    specifications.forEach( s => {
      const d: ProductSpecificationDTO = s as unknown as ProductSpecificationDTO
      MyUtils.deleteObjectFieldsNotExistingInAnotherObject( d, DEFAULT_PRODUCT_SPECIFICATION_DTO )
      res.push( d )
    } )
    return res
  }

  private async getFilterValueIds( productIds: number[] ): Promise<Pair<number, number>[]> {
    if ( !productIds.length ) {
      return []
    }
    return (await CatProductFilterValue.findAll( {
        where: { productId: productIds }, raw: true,
        attributes: {
          include: [ 'productId', 'filterValueId' ],
        },
      } )
    ).map( e => {
      return { id: e.productId, value: e.filterValueId }
    } )
  }

  private async getCategoryIds( productIds: number[] ): Promise<Pair<number, number>[]> {
    if ( !productIds.length ) {
      return []
    }

    return (await CatProductCategory.findAll( {
        where: { productId: productIds }, raw: true,
        attributes: {
          include: [ 'productId', 'categoryId' ],
        },
      } )
    ).map( e => {
      return { id: e.productId, value: e.categoryId }
    } )
  }


  private async getProductFilesDTO( productIds: number[] ): Promise<ProductFileDTO[]> {
    if ( !productIds.length ) {
      return []
    }
    const res: ProductFileDTO[] = []
    const productFiles = await CatProductFiles.findAll( {
      where: { productId: productIds },
      raw: true,
      order: [ 'type', 'sortIndex' ],
    } )

    productFiles.forEach( s => {
      const d: ProductFileDTO = s as unknown as ProductFileDTO

      MyUtils.deleteObjectFieldsNotExistingInAnotherObject( d, DEFAULT_PRODUCT_FILE_DTO )
      res.push( d )
    } )
    return res
  }

  private async getChildrenIds( productIds: number[] ): Promise<Pair<number, number>[]> {
    if ( !productIds.length ) {
      return []
    }
    return (await CatProduct.findAll( {
      where: { parentId: productIds },
      raw: true,
      attributes: {
        include: [ 'id', 'parentId' ],
      },
    } )).map( e => {
      return { id: e.parentId, value: e.id }
    } )
  }

  // clearQty( data: CatStockTemp | CatProduct, clearStockLocal = true, clearStockCatalog = true, clearInWayCatalog = true ) {
  clearQty( data: CatProduct | CatStockTemp, clearStockLocal = true, clearStockCatalog = true, clearInWayCatalog = true ) {
    if ( clearStockLocal ) {
      data.stockLocalFree = 0
      data.stockLocalReserve = 0
      data.stockLocalTotal = 0
    }
    if ( clearStockCatalog ) {
      data.stockCatalogFree = 0
      data.stockCatalogReserve = 0
      data.stockCatalogTotal = 0
    }
    if ( clearInWayCatalog ) {
      data.inWayCatalogFree = 0
      data.inWayCatalogReserve = 0
      data.inWayCatalogTotal = 0
    }
  }

  async findProductsByGroupCode( catalogId: number, catalogGroupCode: string, transaction?: Transaction ): Promise<CatProduct[]> {
    if ( !catalogGroupCode ) return []
    return CatProduct.findAll( {
      where: { catalogId, catalogGroupCode },
      order: [ 'id' ],
      raw: true,
      transaction,
    } )
  }

  calculateCommonArticleByChildren( childrenArts: string[], arrayOfTailsToTrim = [ '.', '/' ], multipleSuffix = ' +' ): string {
    if ( !childrenArts.length ) {
      return ''
    }
    const fallbackArticle = childrenArts[ 0 ] + multipleSuffix
    const artLeft = childrenArts.map( el => StrUtils.stringBefore( el, arrayOfTailsToTrim ) )
    const articles = StrUtils.getArrayOfUniqueValuesAndSortByRepeatCountDesc( artLeft )
    const size = articles.length
    if ( !size ) {
      return fallbackArticle
      // return ''
    } else if ( size === 1 ) {
      return articles[ 0 ] || fallbackArticle
    }
    return articles[ 0 ] ? articles[ 0 ] + multipleSuffix : fallbackArticle
  }


}


