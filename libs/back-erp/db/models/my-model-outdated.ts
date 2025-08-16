import {MyModel} from './my-model'
import {Column, DataType} from 'sequelize-typescript'

export class MyModelOutdated extends MyModel {

  @Column({type: DataType.BOOLEAN, defaultValue: false, allowNull: false})
  outdated: boolean = false

  @Column({type: DataType.BOOLEAN, defaultValue: false, allowNull: false})
  outdatedForLoading: boolean = false

}
