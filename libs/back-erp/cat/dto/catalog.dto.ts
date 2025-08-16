import {CatCatalog} from '../entities/catalog.entity';

export type CatCatalogEditDTO = Partial<CatCatalog>
export type CatCatalogListItemDTO = Partial<CatCatalog>

export interface CatCatalogSiteDTO {
  id: number
  common: boolean
  sortIndex: number
  name: string
  type: string
  site: string
  cloudCatalogId: string | null
  icon?: any
}

export interface SetConnectionDTO {
  connected: boolean
  id1: number
  id2: number
}

export interface SetSortDTO {
  id: number
  sortIndex: number
}
