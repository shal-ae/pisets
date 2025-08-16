import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {MyModelOutdatedTimestamps} from '../../db/models/my-model-outdated-timestamps'
import {TABLE_NAME_FILTER} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_FILTER,
  indexes: [
    {name: 'unq_cat_filter__catalog_catalogCode', fields: ['catalogCode', 'catalogId'], unique: true},
  ],
})
export class CatFilter extends MyModelOutdatedTimestamps {
  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @Column({type: DataType.STRING(150), allowNull: false})
  catalogCode: string

  @Column
  sortIndex: number

  @Column
  type: string
  // @Column({type: DataType.ENUM, values: Object.values(CatFilterType)})
  // type: CatFilterType

  @Column
  name: string


}
