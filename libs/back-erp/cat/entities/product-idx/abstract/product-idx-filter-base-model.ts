import {MyModelOutdated} from '../../../../db/models/my-model-outdated'
import {Column} from 'sequelize-typescript'

export class CatProductIdxFilterBase extends MyModelOutdated {
  @Column
  filterId: number

  @Column
  productId: number

  @Column
  catalogId: number

}
