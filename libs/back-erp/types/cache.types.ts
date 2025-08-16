export type CacheResult = 'modified' | 'added' | 'notModified' | 'fetched' | 'notFound'

export interface CacheHashAndModified<O> {
  id: number
  options?: O
  hash: string
  addedAt: Date
  modifiedAt: Date
  actualAt: Date
}

export interface CacheDTO<T, O = any> {
  id: number
  data: T | null | undefined
  options?: O
  hash: string
  addedAt: Date
  modifiedAt: Date
  actualAt: Date
  result?: CacheResult
}

export interface CacheQueryItem {
  id: number
  ifModifiedSince?: Date
}
