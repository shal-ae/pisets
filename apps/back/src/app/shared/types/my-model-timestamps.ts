import sequelize from 'sequelize'
import { Column, DataType } from 'sequelize-typescript'
import { MyModel } from './my-model'

export class MyModelTimestamps extends MyModel {
  /**  Заполняем defaultValue чтобы значения заполнялись самой БД, а не ORM */
  @Column( {
    type: DataType.DATE,
    defaultValue: sequelize.literal( 'CURRENT_TIMESTAMP' ),
  } )
  createdAt: Date

  @Column( {
    type: DataType.DATE,
    defaultValue: sequelize.literal( 'CURRENT_TIMESTAMP' ),
  } )
  updatedAt: Date
}
