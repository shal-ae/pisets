export interface CategoryLookupInfo {
  ids: number[]
  catalog: CategoryLookupInfoItem[]
  common: CategoryLookupInfoItem[]
}

export interface CategoryValueLookupInfoItem {
  id: number
  name: string
  parentId: number | null
}

export interface CategoryLookupInfoItem {
  id: number
  connectedIds?: number[]
  doNotConnectToCommon?: boolean
  path: CategoryValueLookupInfoItem[]
}
