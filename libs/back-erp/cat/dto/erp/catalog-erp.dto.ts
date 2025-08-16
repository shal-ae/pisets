export interface CatalogErpDto {
  id: number
  common: boolean
  sortIndex: number
  name: string
  code: string
  type: string
  site: string
  cloudCatalogId: string | null
  icon: any | null
}
