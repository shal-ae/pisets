import { CacheDTO, CacheQueryItem } from '@app/back/types/cache.types'
import { ProductGroupErpDTO, ProductProductErpDTO } from '@app/back/cat/dto/erp/product-erp.dto'
import { StockAndPricesItemErpDTO } from '@app/back/cat/dto/erp/stock-erp.dto'
import { CategoryLookupInfo } from './category-lookup.types'
import { FilterLookupInfo } from '@app/back/cat/types/erp/filter-lookup.types'
import { SpecificationLookupInfo } from '@app/back/cat/types/erp/specification-lookup.types'

export class ProductViewQuery {
  /** Можно указать массив Ид productAndStockIds или groupIds - вместо products и stocks,
   *
   * если ifModifiedSince не используется  */
  groupIds?: number[]
  productAndStockIds?: number[]
  includeAllColors?: boolean
  products?: CacheQueryItem[]
  stocks?: CacheQueryItem[]
  lookups?: ProductViewQueryLookupFields
}

export class ProductViewQueryLookupFields {
  filtersForProducts?: number[]
  categoriesForProducts?: number[]
  specificationsForProducts?: number[]
  groupViewsForProducts?: number[]
}

export class ProductViewResult {
  products?: CacheDTO<ProductProductErpDTO>[]
  stocks?: CacheDTO<StockAndPricesItemErpDTO>[]
  lookups?: {
    filters?: Record<number, FilterLookupInfo>
    categories?: Record<number, CategoryLookupInfo>
    specifications?: Record<number, SpecificationLookupInfo>
    groups?: Record<number, ProductGroupErpDTO>
  }
}
