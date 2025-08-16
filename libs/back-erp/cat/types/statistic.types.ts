export interface CatalogStat {
  catalogId: number
  product: ProductsStat
  files: FilesStat
  filters: FiltersStat[]
  categories: CategoriesStat
  specifications: SpecificationsStat
  stock: stockStat
}

export interface ProductsStat {
  noParentCount: number
  productCount: number
  skuCount: number
}

export interface FilesStat {
  count: number
  downloadErrorCount: number
  totalFileSize: number
}

export interface FiltersStat {
  filterId: number
  type: string
  valuesCount: number
  ignoreValuesCount: number
  valuesToConnectCount: number
}

export type AllFilterValuesStat = {
  [key: number]: FiltersStat[]
}

export type FilterValuesStat = {
  catalogId: number
  stat: FiltersStat[]
}

export interface CategoriesStat {
  valuesToConnectCount: number
}

export type CategoriesToConnectStat = {
  [key: number]: number
}

export interface SpecificationsStat {
  needAttentionItemsCount: number
}

export interface stockStat {
  freeVolumeSitePrices: number
  reserveVolumeSitePrices: number
  totalVolumeSitePrices: number
}

export interface NotConnectedFilterInfo {
  id: number
  cnt: number
}

export interface NotConnectedCategoriesInfo {
  catalogId: number
  cnt: number
}