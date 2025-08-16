import { Column, DataType, Model } from 'sequelize-typescript'

export class MyModel extends Model {
  /**  Заполняем autoIncrement чтобы значения заполнялись самой БД, а не ORM */
  @Column( {
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  } )
  id: number
}
