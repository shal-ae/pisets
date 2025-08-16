import {MyModel} from './my-model'
import {Column, DataType} from 'sequelize-typescript'
import sequelize from 'sequelize'

export class MyModelTimestamps extends MyModel {

  @Column({type: DataType.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')})
  createdAt: Date

  @Column({type: DataType.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')})
  updatedAt: Date

}
