export interface ExportCatalogsResult {
  count: number
}

export interface ExportFiltersResult {
  filterCount: number
  filterValuesCount: number
  connectionsCount: number
}

export interface ExportCategoriesResult {
  count: number
  connectionsCount: number
}

export interface ExportSpecificationsResult {
  count: number
}

export interface ExportProductItemsResult {
  count: number
}

export interface ExportProductsResult {
  catalogs: ExportCatalogsResult
  filters: ExportFiltersResult
  categories: ExportCategoriesResult
  specifications: ExportSpecificationsResult
  products: ExportProductItemsResult
}

export function ExportProductsResultToString(res: ExportProductsResult): string {
  return `Товаров: ${res.products.count}, Каталогов: ${res.catalogs.count}, ` +
    `Фильтров/Значений/Соединений: ${res.filters.filterCount}/${res.filters.filterValuesCount}/${res.filters.connectionsCount}, ` +
    `Категорий/Соединений: ${res.categories.count}/${res.categories.connectionsCount}, ` +
    `Спецификаций: ${res.specifications.count}`
}

export interface ExportStockResult {
  count: number
}

export function ExportStockResultToString(res: ExportStockResult): string {
  return `Товаров: ${res.count}`
}

export type ExportCatalogInfo = {
  loadedAt: Date
  loadedAtUnixTime: number
}

export interface ErpStockAndPrices {
  id: number
  type: number
  parentId: number
  stockCatalogFree: number
  stockCatalogReserve: number
  stockLocalFree: number
  stockLocalReserve: number
  inWayCatalogFree: number
  inWayCatalogReserve: number
  priceRetail: number
  priceDealer: number
}
