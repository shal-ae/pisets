import {Column, DataType, Model} from 'sequelize-typescript'

export class MyModel extends Model {
  @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true})
  id: number

}

