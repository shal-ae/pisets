import {CatStockTemp} from '@app/back/cat/entities/stock-temp.entity';
import {CatProduct} from '@app/back/cat/entities/product.entity';
import {CatProductType} from '@app/back/cat/types/product.types';
import {Sequelize} from 'sequelize-typescript';

export class LoadStockUtils {

  static async makeOutdatedStockTempOfCatalog(catalogId: number) {
    await CatStockTemp.update({
      outdated: true,
      stockLocalFree: 0,
      stockLocalReserve: 0,
      stockLocalTotal: 0,
      stockCatalogFree: 0,
      stockCatalogReserve: 0,
      stockCatalogTotal: 0,
      inWayCatalogFree: 0,
      inWayCatalogReserve: 0,
      inWayCatalogTotal: 0,
    }, {where: {catalogId}, returning: false})
  }

  static async fillStockDataOfCatalogFromTempTable(sequelize: Sequelize, catalogId: number) {
    await this.clearStockDataOfCatalog(catalogId)
    await this.applyStockDataOfCatalog(sequelize, catalogId)
    await this.setProductStockAsSumOfChildren(sequelize, catalogId)
  }

  private static async clearStockDataOfCatalog(catalogId: number) {
    await CatProduct.update({
      stockLocalFree: 0,
      stockLocalReserve: 0,
      stockLocalTotal: 0,
      stockCatalogFree: 0,
      stockCatalogReserve: 0,
      stockCatalogTotal: 0,
      inWayCatalogFree: 0,
      inWayCatalogReserve: 0,
      inWayCatalogTotal: 0,
    }, {where: {catalogId}, returning: false})
  }

  private static async applyStockDataOfCatalog(sequelize: Sequelize, catalogId: number) {
    return sequelize.query(`
        MERGE INTO cat__product p
        USING (select * from cat__stock_temp where "catalogId" = :catalogId AND NOT outdated) t
        ON t."productId" = p.id
        WHEN MATCHED THEN
          UPDATE SET 
                   "stockLocalFree"      = t."stockLocalFree",
                   "stockLocalReserve"   = t."stockLocalReserve",
                   "stockLocalTotal"     = t."stockLocalTotal",
                   "stockCatalogFree"    = t."stockCatalogFree",
                   "stockCatalogReserve" = t."stockCatalogReserve",
                   "stockCatalogTotal"   = t."stockCatalogTotal",
                   "inWayCatalogFree"    = t."inWayCatalogFree",
                   "inWayCatalogReserve" = t."inWayCatalogReserve",
                   "inWayCatalogTotal"   = t."inWayCatalogTotal"
    `,
      {
        replacements: {
          catalogId,
        },
      })

  }

  static async setProductStockAsSumOfChildren(sequelize: Sequelize, catalogId: number) {
    await this.setProductStockAsSumOfChildrenForProductType(sequelize, catalogId, [CatProductType.size])
    await this.setProductStockAsSumOfChildrenForProductType(sequelize, catalogId,
      [CatProductType.productWithSizes, CatProductType.product])
  }

  private static async setProductStockAsSumOfChildrenForProductType(sequelize: Sequelize, catalogId: number, productTypes: CatProductType[]) {
    await sequelize.query(`
       MERGE INTO cat__product p
          USING (
          SELECT cat__product."parentId",
            SUM(cat__product."stockCatalogTotal") AS "stockCatalogTotal",
            SUM(cat__product."stockCatalogFree") AS "stockCatalogFree",
            SUM(cat__product."stockCatalogReserve") AS "stockCatalogReserve",
            SUM(cat__product."stockLocalTotal") AS "stockLocalTotal",
            SUM(cat__product."stockLocalFree") AS "stockLocalFree",
            SUM(cat__product."stockLocalReserve") AS "stockLocalReserve",
            SUM(cat__product."inWayCatalogFree") AS "inWayCatalogFree",
            SUM(cat__product."inWayCatalogReserve") AS "inWayCatalogReserve",
            SUM(cat__product."inWayCatalogTotal") AS "inWayCatalogTotal"
            FROM cat__product
            WHERE NOT "outdatedForLoading"
            and "parentId" is not null
            AND "catalogId" = :catalogId
            AND "type" IN (:productTypes)
            GROUP BY cat__product."parentId") t
            
        ON t."parentId" = p.id
        WHEN MATCHED THEN
          UPDATE SET 
                   "stockLocalFree"      = t."stockLocalFree",
                   "stockLocalReserve"   = t."stockLocalReserve",
                   "stockLocalTotal"     = t."stockLocalTotal",
                   "stockCatalogFree"    = t."stockCatalogFree",
                   "stockCatalogReserve" = t."stockCatalogReserve",
                   "stockCatalogTotal"   = t."stockCatalogTotal",
                   "inWayCatalogFree"    = t."inWayCatalogFree",
                   "inWayCatalogReserve" = t."inWayCatalogReserve",
                   "inWayCatalogTotal"   = t."inWayCatalogTotal"
`, {
        replacements: {
          catalogId,
          productTypes,
        },
      },
    )
  }


}
