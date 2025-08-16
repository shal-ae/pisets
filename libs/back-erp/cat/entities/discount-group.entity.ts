import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {MyModelOutdatedTimestamps} from '../../db/models/my-model-outdated-timestamps'
import {TABLE_NAME_DISCOUNT_GROUPS} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_DISCOUNT_GROUPS,
  indexes: [
    {name: 'unq_cat_discountGroup_catalogCode', fields: ['catalogCode', 'catalogId'], unique: true},
  ],
})
export class CatDiscountGroup extends MyModelOutdatedTimestamps {
  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @Column({allowNull: false})
  catalogCode: string

  @Column
  name: string

  @Column({type: DataType.DECIMAL(10, 2)})
  discount: number

}

