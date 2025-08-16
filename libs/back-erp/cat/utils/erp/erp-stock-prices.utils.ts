import { StockAndPricesItemErpDTO } from '@app/back/cat/dto/erp/stock-erp.dto'
import { CatProductType } from '@app/back/cat/types/product.types'
import { ErpStockAndPrices } from '@app/back/cat/types/erp/export.types'
import { QueryTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { CacheUtils } from '@app/back/utils/cache.utils'
import { CacheStockAndPrices } from '@app/back/cat/entities/cache/cache-product'

export class ErpStockPricesUtils {

  private static productItemToStockAndPricesCatalogItem( p: ErpStockAndPrices ): StockAndPricesItemErpDTO {
    const res: StockAndPricesItemErpDTO = {id: p.id}

    if ( ( p.type === CatProductType.product ) || ( p.type === CatProductType.size ) ) {

      if ( p.stockLocalFree || p.stockLocalReserve || p.stockCatalogFree ||
          p.stockCatalogReserve || p.inWayCatalogFree || p.inWayCatalogReserve ) {

        res.stock = {}

        if ( p.stockLocalFree || p.stockLocalReserve ) {
          res.stock.local = {
            free: p.stockLocalFree || undefined,
            reserve: p.stockLocalReserve || undefined,
          }
        }

        if ( p.stockCatalogFree || p.stockCatalogReserve ) {
          res.stock.catalog = {
            free: p.stockCatalogFree || undefined,
            reserve: p.stockCatalogReserve || undefined,
          }
        }

        if ( p.inWayCatalogFree || p.inWayCatalogReserve ) {
          res.stock.inWayCatalog = {
            free: p.inWayCatalogFree || undefined,
            reserve: p.inWayCatalogReserve || undefined,
          }
        }

      }

      res.price = {
        retail: p.priceRetail,
        dealer: p.priceDealer,
      }
    }
    return res
  }

  static async productToStockErpDto( sequelize: Sequelize, productId: number, saveCache = false ): Promise<StockAndPricesItemErpDTO> {
    const sqlRes = await sequelize.query<ErpStockAndPrices>( `select id,
                                                                     type,
                                                                     "parentId",
                                                                     "stockCatalogFree",
                                                                     "stockCatalogReserve",
                                                                     "stockLocalFree",
                                                                     "stockLocalReserve",
                                                                     "inWayCatalogFree",
                                                                     "inWayCatalogReserve",
                                                                     "priceRetail",
                                                                     "priceDealer"

                                                              from cat__product
                                                              where id = ${ productId }`, {type: QueryTypes.SELECT} )

    const data: ErpStockAndPrices = sqlRes[ 0 ]
    if ( !data ) {
      return null
    }

    const res = this.productItemToStockAndPricesCatalogItem( data )

    if ( data.type === CatProductType.productWithSizes ) {
      res.sizes = []

      const childrenRes = await sequelize.query<ErpStockAndPrices>( `select id,
                                                                            type,
                                                                            "parentId",
                                                                            "stockCatalogFree",
                                                                            "stockCatalogReserve",
                                                                            "stockLocalFree",
                                                                            "stockLocalReserve",
                                                                            "inWayCatalogFree",
                                                                            "inWayCatalogReserve",
                                                                            "priceRetail",
                                                                            "priceDealer"

                                                                     from cat__product
                                                                     where "parentId" = ${ res.id }
                                                                     order by "sortIndex", id`, {type: QueryTypes.SELECT} )

      for ( const childRes of childrenRes ) {
        res.sizes.push( this.productItemToStockAndPricesCatalogItem( childRes ) )
      }
    }

    if ( saveCache ) {
      await CacheUtils.saveData( CacheStockAndPrices, res.id, res )
    }

    return res
  }
}
