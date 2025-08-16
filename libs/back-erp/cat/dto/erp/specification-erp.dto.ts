export interface SpecificationErpDTO {
  id: number
  catalogCode: string
  catalogId: number
  sortIndex: number | null
  name: string
  hidden: boolean | null
  comment: string
  dim: string
  sortIndexForOffers: number
  new: boolean
  showInOffers: boolean
  nameForOffers: string
  manual: boolean
}
