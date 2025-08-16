import {SortOutdatedDTO} from '../../utils/dto'
import {ProductPriceData, ProductStockData} from '../types/product.types'

export class ProductDTO extends SortOutdatedDTO {
  catalogCode: string
  name: string
  size: string
  catalogId: number
  filterValueIds: number[]
  categoryIds: number[]
  specifications: ProductSpecificationDTO[]
  files: ProductFileDTO[]
  type: number
  parentId: number
  childrenIds: number[]
  baseId: string
  article: string
  description: string
  stopped: boolean
  picture: string
  stock: ProductStockData
  price: ProductPriceData
}

export class ProductSpecificationDTO extends SortOutdatedDTO {
  catalogId: number
  productId: number
  specificationId: number
  value: string
  valueForOffers: string
  equalToParentValue: boolean
}


export class ProductFileDTO extends SortOutdatedDTO {
  catalogId: number
  productId: number
  localPath: string
  type: number
}

export const DEFAULT_PRODUCT_DTO: ProductDTO = {
  article: '',
  baseId: '',
  catalogCode: '',
  catalogId: 0,
  categoryIds: [],
  childrenIds: [],
  createdAt: undefined,
  description: '',
  files: [],
  filterValueIds: [],
  id: 0,
  name: '',
  outdated: false,
  outdatedForLoading: false,
  parentId: 0,
  picture: '',
  price: undefined,
  size: '',
  sortIndex: 0,
  specifications: [],
  stock: undefined,
  stopped: false,
  type: 0,
  updatedAt: undefined,
}

export const DEFAULT_PRODUCT_SPECIFICATION_DTO: ProductSpecificationDTO = {
  catalogId: 0,
  createdAt: undefined,
  equalToParentValue: false,
  id: 0,
  outdated: false,
  outdatedForLoading: false,
  productId: 0,
  sortIndex: 0,
  specificationId: 0,
  updatedAt: undefined,
  value: '',
  valueForOffers: '',

}


export const DEFAULT_PRODUCT_FILE_DTO: ProductFileDTO = {
  catalogId: 0,
  createdAt: undefined,
  updatedAt: undefined,
  id: 0,
  outdated: false,
  outdatedForLoading: false,
  productId: 0,
  sortIndex: 0,
  type: 0,
  localPath: '',
}

