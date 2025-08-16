import {CatCatalog} from './entities/catalog.entity';
import {CatCategory} from './entities/category.entity';
import {CatCategoryCategory} from './entities/category-connected.entity';
import {CatFilter} from './entities/filter.entity';
import {CatFilterValue} from './entities/filter-value.entity';
import {CatFilterValueFilterValue} from './entities/filter-value-connected.entity';
import {CatSpecification} from './entities/specification.entity';
import {CatDiscountGroup} from './entities/discount-group.entity';
import {CatProduct} from './entities/product.entity';
import {CatProductCategory} from './entities/product-category.entity';
import {CatProductFilterValue} from './entities/product-filter-value.entity';
import {CatProductSpecification} from './entities/product-specification.entity';
import {CatProductIdxGroup} from './entities/product-idx/product-idx-group.entity';
import {CatProductIdxGroupCategory} from './entities/product-idx/product-idx-group-category.entity';
import {CatProductIdxGroupFilterAll} from './entities/product-idx/product-idx-group-filter-all.entity';
import {CatProductIdxProduct} from './entities/product-idx/product-idx-product.entity';
import {CatProductIdxProductCategory} from './entities/product-idx/product-idx-product-category.entity';
import {CatProductIdxProductFilterAll} from './entities/product-idx/product-idx-product-filter-all.entity';
import {CatStockTemp} from './entities/stock-temp.entity';
import {CatProductFiles} from './entities/product-files.entity';
import {CatBrokenLink} from './entities/broken-link.entity';
import {CacheProduct, CacheStockAndPrices} from '@app/back/cat/entities/cache/cache-product';

export const CATALOG_MODELS = [
  CatCatalog,
  CatCategory, CatCategoryCategory,
  CatFilter, CatFilterValue, CatFilterValueFilterValue,
  CatSpecification,
  CatDiscountGroup,
  CatProduct,
  CatProductCategory,
  CatProductFilterValue,
  CatProductSpecification,

  CatProductIdxGroup, CatProductIdxGroupCategory, CatProductIdxGroupFilterAll,
  CatProductIdxProduct, CatProductIdxProductCategory, CatProductIdxProductFilterAll,

  CatStockTemp,

  CatProductFiles, CatBrokenLink,

  CacheProduct, CacheStockAndPrices,
]
