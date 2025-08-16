export const TABLE_NAME_STATIC_LIST = 'static_list'

export interface StaticListItem<T> {
  id: number
  key?: string
  sortIndex: number | null
  deleted: boolean
  data: T
}

export interface StaticListItemUpdateDTO {
  group: string
  item: Partial<StaticListItem<any>>
}

export interface StaticListHitsUpdateDTO {
  productIds: number[]
}

export interface StaticListHitsFillRandomDTO {
  count: number
  maxOffset: number
}


export const makeKeyForStaticRecord = (group: string, id: number) => group + ':' + id.toString()
export const makeKeyForStaticRecordByKey = (group: string, key: string) => group + ':' + key

export type StaticListData = Record<string, StaticListItem<any>[]>

export const STATIC_LIST_GROUP_PRINT = 'print'
export const STATIC_LIST_GROUP_PARTNERS = 'partners'
export const STATIC_LIST_GROUP_PROS = 'pros'
export const STATIC_LIST_GROUP_EMPLOYEES = 'employees'
export const STATIC_LIST_GROUP_SERVICES = 'services'
export const STATIC_LIST_GROUP_PRODUCTION = 'production'
export const STATIC_LIST_GROUP_BANNERS = 'banners'
export const STATIC_LIST_GROUP_HITS = 'hits'
export const STATIC_LIST_GROUP_CLIENTS = 'clients'

export const STATIC_LIST_SITE_GROUPS: string[] = [
  STATIC_LIST_GROUP_PRINT, STATIC_LIST_GROUP_PARTNERS, STATIC_LIST_GROUP_PROS,
  STATIC_LIST_GROUP_EMPLOYEES, STATIC_LIST_GROUP_SERVICES, STATIC_LIST_GROUP_PRODUCTION,
  STATIC_LIST_GROUP_BANNERS, STATIC_LIST_GROUP_HITS, STATIC_LIST_GROUP_CLIENTS,
]

export const STATIC_LIST_PRODUCT_SIZES = 'clothes-sizes'
