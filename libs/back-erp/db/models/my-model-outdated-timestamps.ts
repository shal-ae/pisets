import {MyModel} from './my-model'
import {Column, DataType} from 'sequelize-typescript'
import sequelize from 'sequelize'

export class MyModelOutdatedTimestamps extends MyModel {

  @Column({type: DataType.BOOLEAN, defaultValue: false, allowNull: false})
  outdated: boolean = false

  @Column({type: DataType.BOOLEAN, defaultValue: false, allowNull: false})
  outdatedForLoading: boolean = false

  @Column({type: DataType.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')})
  createdAt: Date

  @Column({type: DataType.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')})
  updatedAt: Date

}
