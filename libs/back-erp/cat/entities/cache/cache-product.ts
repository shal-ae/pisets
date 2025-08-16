import {Table} from 'sequelize-typescript';
import {TABLE_NAME_CACHE_PRODUCT, TABLE_NAME_CACHE_STOCK_AND_PRICES} from '@app/back/cat/types/cat.tables';
import {CacheModel} from '@app/back/db/models/cache-model';
import {ProductProductErpDTO} from '@app/back/cat/dto/erp/product-erp.dto';
import {StockAndPricesItemErpDTO} from '@app/back/cat/dto/erp/stock-erp.dto';

@Table({tableName: TABLE_NAME_CACHE_PRODUCT, timestamps: false})
export class CacheProduct extends CacheModel<ProductProductErpDTO> {
}

@Table({tableName: TABLE_NAME_CACHE_STOCK_AND_PRICES, timestamps: false})
export class CacheStockAndPrices extends CacheModel<StockAndPricesItemErpDTO> {
}
