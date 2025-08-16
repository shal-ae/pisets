export interface CatCategoryFlatDTO {
  id: number
  name: string
  parentId: number
  outdated: boolean
  catalogId: number
  sortIndex: number
  connectedIds: number[]
  doNotConnectToCommon: boolean
  connectTo?: number
  catalogCode: string
  useCount: number
  picture: string
  slug: string
  old_id: number
  hiddenForSite: boolean
}
