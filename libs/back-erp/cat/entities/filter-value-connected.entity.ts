import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatFilterValue} from './filter-value.entity'
import {MyModel} from '../../db/models/my-model'
import {TABLE_NAME_FILTER_CONNECTED} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_FILTER_CONNECTED,
  timestamps: false,
  indexes: [
    {name: 'cat_filter_connected', fields: ['filterValue1id', 'filterValue2id'], unique: true},
  ],
})
export class CatFilterValueFilterValue extends MyModel {

  @ForeignKey(() => CatFilterValue)
  @Column({type: DataType.INTEGER, allowNull: false})
  filterValue1id: number

  @BelongsTo(() => CatFilterValue, {onDelete: 'CASCADE'})
  filterValue1: CatFilterValue

  @ForeignKey(() => CatFilterValue)
  @Column({type: DataType.INTEGER, allowNull: false})
  filterValue2id: number

  @BelongsTo(() => CatFilterValue, {onDelete: 'CASCADE'})
  filterValue2: CatFilterValue

}
