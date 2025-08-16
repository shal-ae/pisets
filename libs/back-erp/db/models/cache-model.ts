import {Column, DataType, Model} from 'sequelize-typescript'

export class CacheModel<T, O = any> extends Model {
  @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: false})
  id: number

  @Column({type: DataType.DATE, allowNull: false})
  addedAt: Date

  @Column({type: DataType.DATE, allowNull: false})
  modifiedAt: Date

  @Column({type: DataType.DATE, allowNull: false})
  actualAt: Date

  @Column({type: DataType.JSONB, allowNull: false})
  data: T

  @Column({type: DataType.JSONB, allowNull: true})
  options: O

  @Column({type: DataType.STRING(50), allowNull: false})
  hash: string

}
