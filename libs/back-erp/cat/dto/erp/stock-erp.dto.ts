import {DeepPartial} from '@app/back/utils/my-utils';
import {ProductStockData} from '@app/back/cat/types/product.types';

/**
 *   Для передачи остатков из ERP
 * */
export interface StockAndPricesItemErpDTO {
  /** Product id */
  id: number

  /** Для уменьшения размера указываем ненулевые (total не считаем)
   *
   *  free: number
   *
   *  reserve: number
   */
  stock?: DeepPartial<ProductStockData>

  /** Если товар с размерами - то остатки вложены здесь  */
  sizes?: StockAndPricesItemErpDTO[]

  /**  Цены для товаров и размеров
   *
   * (Кроме товаров с размерами, так как цена по размерам может отличаться )
   * */
  price?: PriceItemErpDTO
}

export interface PriceItemErpDTO {
  retail: number
  dealer?: number
}
