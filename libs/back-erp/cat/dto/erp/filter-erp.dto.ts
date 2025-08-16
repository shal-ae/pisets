export interface FilterValueErpDTO {
  id: number
  catalogCode: string
  sortIndex: number
  filterId: number
  name: string
  doNotConnectToCommon: boolean
  useCount: number
  icon: any | null
}

export interface FilterErpDTO {
  id: number
  catalogCode: string
  catalogId: number
  sortIndex: number
  type: string
  name: string

  values: FilterValueErpDTO[]

}

export interface FilterValueConnectionErpDTO {
  id1: number
  id2: number
}

export interface FilterDataErpDTO {
  filters: FilterErpDTO[]
  connections: FilterValueConnectionErpDTO[]
}
