export interface CategoryErpDTO {
  id: number
  catalogCode: string
  catalogId: number
  name: string
  parentId: number | null
  sortIndex: number | null
  doNotConnectToCommon: boolean | null
  useCount: number
  picture: string | null
  slug: string | null
  old_id: number | null
}

export interface CategoryConnectionErpDTO {
  id1: number
  id2: number
}

export interface CategoryDataErpDTO {
  categories: CategoryErpDTO[]
  connections: CategoryConnectionErpDTO[]
}
