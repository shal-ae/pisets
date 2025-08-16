export interface BaseProductErpDTO {
  id: number
  catalogId: number
  type: number
  name: string
  article: string
  stopped?: boolean
}

export interface ProductGroupErpDTO extends BaseProductErpDTO {
  catalogCode?: string
}

export interface ProductSpecificationErpDTO {
  specId: number
  sortIndex?: number
  value: string
  valueForOffers?: string
}

export interface ProductProductErpDTO extends BaseProductErpDTO {
  parentId: number | null
  catalogCode?: string
  size?: string
  description?: string
  filterIds: number[]
  categoryIds: number[]

  pics: string[]
  specs: ProductSpecificationErpDTO[]

  /** Если тип 3 - ProductWithSizes */
  productSizes?: ProductSizeErpDTO[]
}

export interface ProductSizeErpDTO {
  id: number
  name: string
  article: string
  stopped?: boolean
  catalogCode: string
  size: string
}

export interface ProductDataErpDTO {
  groups: ProductGroupErpDTO[]
  products: ProductProductErpDTO[]
}
