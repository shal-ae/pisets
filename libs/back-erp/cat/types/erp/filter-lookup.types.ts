export interface FilterLookupInfo {
  ids: number[]
  standard: {
    [type: string]: FilterLookupInfoItem
  }
  common: {
    [type: string]: FilterLookupInfoItem
  }
  others: FilterLookupInfoItem[]
}

export interface FilterValueLookupInfoItem {
  id: number
  name: string
  doNotConnectToCommon?: boolean
  connectedIds?: number[]
}

export interface FilterLookupInfoItem {
  id: number
  name: string
  values: FilterValueLookupInfoItem[]
}
