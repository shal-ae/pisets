export const CATALOG_FILES_FILENAME = 'downloaded-file-paths.json'
export const CATALOG_FILES_SRC_LOCAL_FILENAME = 'downloaded-files-src-local.json'
export const CATALOG_LOAD_INFO_FILENAME_PRODUCT = 'downloaded-info-product.json'
export const CATALOG_LOAD_INFO_FILENAME_STOCK = 'downloaded-info-stock.json'
export const CATALOG_FILES_FOLDER = 'files'
export const DEFAULT_CODEPAGE = 'utf-8'

export const CAT_LOADER_LOGGER_NAME = 'cat-loader'

export interface DeleteOutdatedResult {
  tableName: string
  ok: boolean
  message: string
}

export interface LoadStockResult {
  processed: number
  notFound: number
}

export interface LoadProductResult {
  processed: number
}

export interface CheckFilesResult {
  filesProcessed: number
  filesExist: number
  totalSize: number
}

export interface DownloadFilesResult {
  filesProcessed: number
  filesExist: number
  filesDownloaded: number
  filesError: number
  filesSkipped: number
}

export interface ProductsPostProcessingResult {
  processed: number
}

export type CatalogLoadInfo = {
  loadedAt: Date
  loadedAtUnixTime: number
}

export type SourcePathAndLocalPathRecord = {
  sourcePath: string,
  localPath: string
}

