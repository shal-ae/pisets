export const TABLE_NAME_BACKGROUND_PROCESS = 'sys__background_process'

export enum SysProcessStatus {
  starting = 'starting',
  working = 'working',
  stopping = 'stopping',
}

export enum SysProcessEndReason {
  done = 'done',
  stopped = 'stopped',
  error = 'error'
}

/**
 *  Эти константы можно дополнить в любом каталоге проекта
 *  */
export const SYS_PROCESS_CATALOG_LOAD_STOCK = 'catalogLoadStock'
export const SYS_PROCESS_CATALOG_LOAD_PRODUCTS = 'catalogLoadProducts'
export const SYS_PROCESS_CATALOG_DOWNLOAD_ABSENT_FILES = 'catalogDownloadAbsentFiles'
export const SYS_PROCESS_CATALOG_CHECK_FILES = 'catalogCheckFiles'
export const SYS_PROCESS_CATALOG_PROCESSING = 'catalogProcessing'
export const SYS_PROCESS_COMMON_CATALOG_SAVE_STOCK = 'commonCatalogSaveStock'
export const SYS_PROCESS_COMMON_CATALOG_SAVE_PRODUCTS = 'commonCatalogSaveProducts'
