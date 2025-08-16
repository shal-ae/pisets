import {Sequelize} from 'sequelize-typescript';

export interface TableNames {
  tableProduct: string
  tableCategory: string
  tableFilters: string
}

export class ProductIdxUtils {

  /* Имена индексных таблиц MySQL для поиска товаров. noParent - ищем группы и товары без группы, иначе - ищем товары */
  static getTableNames(noParent: boolean): TableNames {
    if (noParent) {
      return {
        tableProduct: 'cat__product_idx_group',
        tableCategory: 'cat__product_idx_group_category',
        tableFilters: 'cat__product_idx_group_filter_all',
      }
    } else {
      return {
        tableProduct: 'cat__product_idx_product',
        tableCategory: 'cat__product_idx_product_category',
        tableFilters: 'cat__product_idx_product_filter_all',
      }
    }
  }

  static async addProductsToIndex(seq: Sequelize, tableName: string, catalogId: number, noParent: boolean) {
    if (!catalogId) return
    const insertField = noParent ? '' : ', "parentId", "sortIndex"'
    const insertValues = noParent ? '' : ', cat__product."parentId", cat__product."sortIndex" '
    const updateField = noParent ? '' : ', "parentId" = cat__product."parentId", "sortIndex" = cat__product."sortIndex"'
    await seq.query(`
    MERGE INTO "${tableName}" p
           USING ( select * from cat__product where "catalogId" = :catalogId AND 
           ${noParent ? '"parentId" is null' : 'type in (2,3)'}  
           ) "cat__product" 
        ON "cat__product"."id" = p."productId"
            WHEN MATCHED THEN
              UPDATE SET "outdatedForLoading" = false,
                        "outdated"                     = cat__product."outdated",
                        "productId"                    = cat__product."id",
                        "catalogId"                    = cat__product."catalogId",
                        "name"                         = cat__product."name",
                        "article"                      = cat__product."article",
                        "priceRetail"                  = cat__product."priceRetail",
                        "priceDealer"                  = cat__product."priceDealer",
                        "priceRetailChildrenMax"       = cat__product."priceRetailChildrenMax",
                        "priceDealerChildrenMax"       = cat__product."priceDealerChildrenMax",
                        "picture"                      = cat__product."picture",
                        "stopped"                      = cat__product."stopped",
                        "type"                         = cat__product."type",
                        "stockLocalFree"               = cat__product."stockLocalFree",
                        "stockLocalReserve"            = cat__product."stockLocalReserve",
                        "stockLocalTotal"              = cat__product."stockLocalTotal",
                        "stockCatalogFree"             = cat__product."stockCatalogFree",
                        "stockCatalogReserve"          = cat__product."stockCatalogReserve",
                        "stockCatalogTotal"            = cat__product."stockCatalogTotal",
                        "inWayCatalogFree"             = cat__product."inWayCatalogFree",
                        "inWayCatalogReserve"          = cat__product."inWayCatalogReserve",
                        "inWayCatalogTotal"            = cat__product."inWayCatalogTotal",
                        "stockPlusInWayCatalogFree"    = cat__product."stockCatalogFree" + cat__product."inWayCatalogFree",
                        "stockPlusInWayCatalogReserve" = cat__product."stockCatalogReserve" + cat__product."inWayCatalogReserve",
                        "stockPlusInWayCatalogTotal"   = cat__product."stockCatalogTotal" + cat__product."inWayCatalogTotal",
                        "created"                      = cat__product."createdAt"
                        ${updateField}
    WHEN NOT MATCHED THEN
    INSERT (
            "outdatedForLoading", "outdated", "productId",
            "catalogId", "name", "article", "priceRetail", "priceDealer",
            "priceRetailChildrenMax", "priceDealerChildrenMax",
            "picture", "stopped", "type",
            "stockLocalFree", "stockLocalReserve", "stockLocalTotal",
            "stockCatalogFree", "stockCatalogReserve", "stockCatalogTotal",
            "inWayCatalogFree", "inWayCatalogReserve", "inWayCatalogTotal",
            "stockPlusInWayCatalogFree", "stockPlusInWayCatalogReserve",
            "stockPlusInWayCatalogTotal",
            "created"
            ${insertField})
    VALUES (false,
            cat__product."outdated",
            cat__product."id",
            cat__product."catalogId",
            cat__product."name",
            cat__product."article",
            cat__product."priceRetail",
            cat__product."priceDealer",
            cat__product."priceRetailChildrenMax",
            cat__product."priceDealerChildrenMax",
            cat__product."picture",
            cat__product."stopped",
            cat__product."type",
            cat__product."stockLocalFree",
            cat__product."stockLocalReserve",
            cat__product."stockLocalTotal",
            cat__product."stockCatalogFree",
            cat__product."stockCatalogReserve",
            cat__product."stockCatalogTotal",
            cat__product."inWayCatalogFree",
            cat__product."inWayCatalogReserve",
            cat__product."inWayCatalogTotal",
            cat__product."stockCatalogFree" + cat__product."inWayCatalogFree",
            cat__product."stockCatalogReserve" + cat__product."inWayCatalogReserve",
            cat__product."stockCatalogTotal" + cat__product."inWayCatalogTotal",
            cat__product."createdAt"
            ${insertValues})    
            `, {replacements: {catalogId}})
  }

  static async addFiltersToProductIndexTable(seq: Sequelize, filterTableName: string, productTableName: string, catalogId: number, filterIds: number[]) {
    if (!catalogId || !filterIds || !filterIds.length) return

    await seq.query(`
    MERGE INTO "${filterTableName}" p
       USING (
      SELECT "productId", "filterValueId", "catalogId"
           FROM cat__product_filter_value
           WHERE "catalogId" = :catalogId
             AND NOT outdated
             AND "filterId" IN (:filterIds)
             AND "productId" IN
          (SELECT "productId" from ${productTableName} WHERE "catalogId" = :catalogId AND NOT outdated)) s
    ON s."productId" = p."productId" AND s."filterValueId" = p."filterId"
    WHEN MATCHED THEN
          UPDATE SET "outdated" = false, "outdatedForLoading" = false
    WHEN NOT MATCHED THEN
      INSERT ("productId", "filterId", "catalogId", "outdated", "outdatedForLoading")
      VALUES (s."productId", s."filterValueId", s."catalogId", false, false)`,
      {replacements: {catalogId, filterIds}},
    )
  }

  static async addCategoriesToProductIndexTable(seq: Sequelize, categoryTableName: string, productTableName: string, catalogId: number) {
    if (!catalogId) return
    await seq.query(`
    MERGE INTO "${categoryTableName}" p
       USING (
      SELECT "productId", "categoryId", "catalogId"
           FROM cat__product_category
           WHERE "catalogId" = :catalogId
             AND NOT outdated
             AND "productId" IN
          (SELECT "productId" from ${productTableName} WHERE "catalogId" = :catalogId AND NOT outdated)) s
    ON s."productId" = p."productId" AND s."categoryId" = p."filterId"
    WHEN MATCHED THEN
          UPDATE SET "outdated" = false, "outdatedForLoading" = false
    WHEN NOT MATCHED THEN
      INSERT ("productId", "filterId", "catalogId", "outdated", "outdatedForLoading")
      VALUES (s."productId", s."categoryId", s."catalogId", false, false)`, {
        replacements: {
          catalogId,
        },
      },
    )
  }

  static async markOutdatedForCatalog(seq: Sequelize, tableName: string, catalogId = 0) {
    await seq.query(`UPDATE ${tableName}
                     SET "outdatedForLoading" = true
                     WHERE "catalogId" = :catalogId
                        OR :catalogId = 0`, {replacements: {catalogId}})
  }

  static async deleteOutdatedForCatalog(seq: Sequelize, tableName: string, catalogId = 0) {
    await seq.query(`DELETE
                     FROM ${tableName}
                     WHERE "outdatedForLoading"
                       AND ("catalogId" = :catalogId OR :catalogId = 0)`,
      {replacements: {catalogId}})
  }

}
