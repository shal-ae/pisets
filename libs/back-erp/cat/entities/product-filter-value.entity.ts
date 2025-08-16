import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {MyModelOutdated} from '../../db/models/my-model-outdated'
import {CatProduct} from './product.entity'
import {CatFilter} from './filter.entity'
import {CatFilterValue} from './filter-value.entity'
import {TABLE_NAME_PRODUCT_FILTER_VALUE} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_PRODUCT_FILTER_VALUE, timestamps: false, indexes: [
    {name: 'UNQ_ProductFV__Pr_fV', fields: ['productId', 'filterValueId'], unique: true},
    {name: 'IDX_ProductFV__Cat', fields: ['catalogId']},
  ],
})
export class CatProductFilterValue extends MyModelOutdated {
  @Column
  sortIndex: number

  @ForeignKey(() => CatProduct)
  @Column({type: DataType.INTEGER, allowNull: false})
  productId: number

  @BelongsTo(() => CatProduct, {onDelete: 'CASCADE'})
  product: CatProduct

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog


  @ForeignKey(() => CatFilter)
  @Column({type: DataType.INTEGER, allowNull: false})
  filterId: number

  @BelongsTo(() => CatFilter, {onDelete: 'RESTRICT'})
  filter: CatFilter

  @ForeignKey(() => CatFilterValue)
  @Column({type: DataType.INTEGER, allowNull: false})
  filterValueId: number

  @BelongsTo(() => CatFilterValue, {onDelete: 'RESTRICT'})
  filterValue: CatFilterValue

}
