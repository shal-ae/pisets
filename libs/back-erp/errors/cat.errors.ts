import {RequestError} from '../interceptors/api-result/api-result-errors'
import {
  ERROR_CATALOG_ALREADY_EXISTS,
  ERROR_CATEGORY_NOT_FOUND,
  ERROR_FILTER_TYPE_ALREADY_EXISTS,
  ERROR_PRODUCT_NOT_FOUND,
} from './error-codes'

export class ProductNotFoundError extends RequestError {
  constructor(public id: number) {
    super(ERROR_PRODUCT_NOT_FOUND, `Товар не найден, id = ${id}`)
  }
}

export class FilterTypeExists extends RequestError {
  constructor(public filterType: string, public catalogId: number) {
    super(ERROR_FILTER_TYPE_ALREADY_EXISTS, `Фильтр типа ${filterType} уже существует у каталога c id = ${catalogId}`)
  }
}

export class CatalogAlreadyExists extends RequestError {
  constructor() {
    super(ERROR_CATALOG_ALREADY_EXISTS, `Каталог уже существует`)
  }
}

export class CategoryNotFound extends RequestError {
  constructor(id: number) {
    super(ERROR_CATEGORY_NOT_FOUND, `Категория не найдена - ${id}`)
  }
}

export class InterruptedByUserError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class CatalogDownloadError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class CatalogMethodNotSupported extends Error {
  constructor(message: string) {
    super(message)
  }
}
