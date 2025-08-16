import {CatProductType} from '@app/back/cat/types/product.types';
import {Sequelize} from 'sequelize-typescript';
import {CatFilter} from '@app/back/cat/entities/filter.entity';
import {
  IDX_TABLE_GROUP,
  IDX_TABLE_GROUP_CATEGORY,
  IDX_TABLE_GROUP_FILTERS,
  IDX_TABLE_NAMES,
  IDX_TABLE_PRODUCT,
  IDX_TABLE_PRODUCT_CATEGORY,
  IDX_TABLE_PRODUCT_FILTERS,
} from '@app/back/cat/types/cat.tables';
import {ProductIdxUtils} from '@app/back/cat/utils/product-idx.utils';

export class LoadCatalogUtils {
  static async calculateCatalogGroupFiltersAsSumOfChildren(sequelize: Sequelize, catalogId: number): Promise<void> {
    await sequelize.query(`
        MERGE INTO cat__product_filter_value p
        USING ( 
            select distinct p."parentId", f."filterValueId", f."filterId" from cat__product AS p 
            INNER JOIN cat__product_filter_value AS f 
            ON p."id" = f."productId" 
            where p."parentId" is not null and p."type" <> :typeSize and NOT f."outdatedForLoading" and NOT p."outdatedForLoading"
            and p."catalogId" = :catalogId and f."catalogId" = :catalogId
        ) c
        ON c."parentId" = p."productId" AND c."filterValueId" = p."filterValueId"
        WHEN MATCHED THEN
            UPDATE SET "outdatedForLoading" = false
        WHEN NOT MATCHED THEN
            INSERT ( "productId", "filterValueId", "filterId", "catalogId", "outdatedForLoading" )
            VALUES ( c."parentId", c."filterValueId", c."filterId", :catalogId, false )    
            `,
      {replacements: {catalogId, typeSize: CatProductType.size}})
  }

  static async calculateCatalogGroupCategoriesAsSumOfChildren(sequelize: Sequelize, catalogId: number): Promise<void> {
    await sequelize.query(`
        MERGE INTO cat__product_category p
        USING ( 
            select distinct p."parentId", f."categoryId" from cat__product AS p 
            INNER JOIN cat__product_category AS f 
            ON p."id" = f."productId" 
            where p."parentId" is not null and p."type" <> :typeSize and NOT f."outdatedForLoading" and NOT p."outdatedForLoading"
            and p."catalogId" = :catalogId and f."catalogId" = :catalogId
        ) c
        ON c."parentId" = p."productId" AND c."categoryId" = p."categoryId"
        WHEN MATCHED THEN
            UPDATE SET "outdatedForLoading" = false
        WHEN NOT MATCHED THEN
            INSERT ( "productId", "categoryId", "catalogId", "outdatedForLoading" )
            VALUES ( c."parentId", c."categoryId", :catalogId, false )    
    `,
      {replacements: {catalogId, typeSize: CatProductType.size}})
  }


  static async setProductPriceAsMinAndMaxOfChildren(sequelize: Sequelize, catalogId: number) {
    await sequelize.query(`
        UPDATE cat__product
        SET "priceDealerChildrenMax" = "priceDealer",
            "priceRetailChildrenMax" = "priceRetail"
        WHERE "catalogId" = :catalogId
          and type in (:productTypes)`, {
      replacements: {
        catalogId,
        productTypes: [CatProductType.size, CatProductType.product],
      },
    })

    await this.setProductPriceAsMinAndMaxOfChildrenForProductType(sequelize, catalogId, [CatProductType.size])
    await this.setProductPriceAsMinAndMaxOfChildrenForProductType(sequelize, catalogId, [CatProductType.productWithSizes, CatProductType.product])
  }

  private static async setProductPriceAsMinAndMaxOfChildrenForProductType(sequelize: Sequelize, catalogId: number, productTypes: CatProductType[]) {
    await sequelize.query(`
        MERGE INTO cat__product p
            USING (
                SELECT cat__product."parentId",
                            MIN(cat__product."priceRetail") AS "priceRetailMin",
                            MIN(cat__product."priceDealer") AS "priceDealerMin",
                            MAX(cat__product."priceRetail") AS "priceRetailMax",
                            MAX(cat__product."priceDealer") AS "priceDealerMax"
                     FROM cat__product
                     WHERE "parentId" is not null
                       AND "catalogId" = :catalogId
                       AND NOT "outdatedForLoading"
                       AND cat__product."type" in (:productTypes)
                     GROUP BY cat__product."parentId" ) t
        ON t."parentId" = p.id
                WHEN MATCHED THEN
                  UPDATE SET
                  "priceRetail"            = t."priceRetailMin",
                  "priceRetailChildrenMax" = t."priceRetailMax",
                  "priceDealer"            = t."priceDealerMin",
                  "priceDealerChildrenMax" = t."priceDealerMax"
`, {
        replacements: {
          catalogId,
          productTypes,
        },
      },
    )
  }

  static async fillIndexForCatalog(sequelize: Sequelize, catalogId: number) {
    const filters = await CatFilter.findAll({where: {catalogId}, raw: true})

    const filterIds = filters.map(e => e.id)

    for (const tableName of IDX_TABLE_NAMES) {
      await ProductIdxUtils.markOutdatedForCatalog(sequelize, tableName, catalogId)
    }

    await ProductIdxUtils.addProductsToIndex(sequelize, IDX_TABLE_GROUP, catalogId, true)
    await ProductIdxUtils.addFiltersToProductIndexTable(sequelize, IDX_TABLE_GROUP_FILTERS, IDX_TABLE_GROUP, catalogId, filterIds)
    await ProductIdxUtils.addCategoriesToProductIndexTable(sequelize, IDX_TABLE_GROUP_CATEGORY, IDX_TABLE_GROUP, catalogId)
    await ProductIdxUtils.addProductsToIndex(sequelize, IDX_TABLE_PRODUCT, catalogId, false)
    await ProductIdxUtils.addFiltersToProductIndexTable(sequelize, IDX_TABLE_PRODUCT_FILTERS, IDX_TABLE_PRODUCT, catalogId, filterIds)
    await ProductIdxUtils.addCategoriesToProductIndexTable(sequelize, IDX_TABLE_PRODUCT_CATEGORY, IDX_TABLE_PRODUCT, catalogId)

    for (const tableName of IDX_TABLE_NAMES) {
      await ProductIdxUtils.deleteOutdatedForCatalog(sequelize, tableName, catalogId)
    }
  }

}
