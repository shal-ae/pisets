export const PICTURE_UPLOAD__MAX_FILE_SIZE = 10 * 1024 * 1024

export const PRODUCT_FILE_LOCAL_PATH_LENGTH = 50

export const FILE_TYPE_IMAGE = 1
export const FILE_TYPE_PLOTTER_SVG = 4
export const FILE_TYPE_PRINT_LAYOUT_CDR = 3
export const FILE_TYPE_PRINT_LAYOUT_PDF = 2
export const FILE_TYPE_OTHER = 0


export enum CatProductType {
  group = 1,
  product = 2,
  productWithSizes = 3,
  size = 4
}


export const TABLE_NAME_SITE_CATEGORY = 'site__category'


export const PRODUCT_STOCK_FIELDS = '"stockLocalFree","stockLocalReserve","stockLocalTotal","stockCatalogFree","stockCatalogReserve","stockCatalogTotal","inWayCatalogFree","inWayCatalogReserve","inWayCatalogTotal"'
export const PRODUCT_PRICE_FIELDS = '"priceRetail","priceDealer","priceRetailChildrenMax","priceDealerChildrenMax"'

export class ProductStock {
  free: number
  reserve: number
  total: number
}

export class ProductStockData {
  local: ProductStock
  catalog: ProductStock
  inWayCatalog: ProductStock
}

export class ProductPriceData {
  retail: number
  dealer: number
  retailChildrenMax: number
  dealerChildrenMax: number
}


export function getPriceDataFromDbFields(item: any): ProductPriceData {
  return {
    retail: + item?.priceRetail,
    dealer: + item?.priceDealer,
    retailChildrenMax: +item?.priceRetailChildrenMax,
    dealerChildrenMax: +item?.priceDealerChildrenMax,
  }
}

export function getStockDataFromDbFields(item: any): ProductStockData {
  return {
    local: {
      free: item.stockLocalFree,
      reserve: item.stockLocalReserve,
      total: item.stockLocalTotal,
    },
    catalog: {
      free: item.stockCatalogFree,
      reserve: item.stockCatalogReserve,
      total: item.stockCatalogTotal,
    },
    inWayCatalog: {
      free: item.inWayCatalogFree,
      reserve: item.inWayCatalogReserve,
      total: item.inWayCatalogTotal,
    },
  }
}

