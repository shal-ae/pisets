export const HAPPY_PRODUCTS_FILE = 'all_items_export.xlm'
export const HAPPY_STOCK_FILE = 'stores_all_items_export.xlm'
export const HAPPY_FILE_LINK_PREFIX = 'https://happygifts.ru/XML/'
export const HAPPY_PRICE_UPLOAD_DIR = 'upload'
export const HAPPY_SEARCH_URL = 'https://happygifts.ru/catalog_new/?q='
export const HAPPY_SITE = 'https://happygifts.ru'

export const HAPPY_SIZE_ENDS = [ 'XS', 'XL', 'L', 'S', '2XL', 'XXL', 'M',
  '10A', '12A', '08A', '06A', '04A',
  '104', '116', '128', '140', '152', '164' ]

export interface DealerPriceRecord {
  priceRetail: number,
  priceDealer: number
}

export interface HappyGiftsSpecificationMetadataRecord {
  xmlProp: string
  name: string
  forSubItems: boolean
  sortIndex?: number
  hidden?: boolean
}
