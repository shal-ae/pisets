export interface SelectProductFilterData {
  parentIds?: number[],
  productIds?: number[],

  offset?: number
  limit?: number
  order?: string

  flat: boolean
  outdated?: boolean
  stopped?: boolean

  catalogIds?: number[],
  categoryIds?: number[],
  filterValueIds?: number[],
  specificationIds?: number[],
  childrenSpecificationIds?: number[],

  nameLike?: string,
  articleLike?: string,
  articleStartOrNameLike?: string,

  article?: string,

  stockCatalogFreeAtLeast?: number,
  stockCatalogReserveAtLeast?: number,
  stockCatalogTotalAtLeast?: number,
  stockInWayCatalogFreeAtLeast?: number,
  stockInWayCatalogReserveAtLeast?: number,
  stockInWayCatalogTotalAtLeast?: number,
  stockLocalFreeAtLeast?: number,
  stockLocalReserveAtLeast?: number,
  stockLocalTotalAtLeast?: number,
  stockPlusInWayCatalogFreeAtLeast?: number,
  stockPlusInWayCatalogReserveAtLeast?: number,
  stockPlusInWayCatalogTotalAtLeast?: number,

  priceDealerMin?: number,
  priceDealerMax?: number,
  priceRetailMin?: number,
  priceRetailMax?: number,
}

export type FilterGroups = FilterGroup[]

interface FilterGroup {
  id: number,
  type: string,
  values: number[]
}

export const QUERY_NAME_SEPARATOR = ' '


export interface SelectProductFilterDataForInputSearch {
  search: string
  limit: number
  order: string
  outdated?: boolean
}
