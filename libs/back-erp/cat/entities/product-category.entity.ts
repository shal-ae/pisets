import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {MyModelOutdated} from '../../db/models/my-model-outdated'
import {CatProduct} from './product.entity'
import {CatCategory} from './category.entity'
import {TABLE_NAME_PRODUCT_CATEGORY} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_PRODUCT_CATEGORY, timestamps: false, indexes: [
    {name: 'UNQ_PrCategory__Pr_Cat', fields: ['productId', 'categoryId'], unique: true},
    {name: 'IDX_PrCategory__Cat', fields: ['catalogId']},
  ],
})
export class CatProductCategory extends MyModelOutdated {
  @ForeignKey(() => CatProduct)
  @Column({type: DataType.INTEGER, allowNull: false})
  productId: number

  @BelongsTo(() => CatProduct, {onDelete: 'CASCADE'})
  product: CatProduct

  @ForeignKey(() => CatCategory)
  @Column({type: DataType.INTEGER, allowNull: false})
  categoryId: number

  @BelongsTo(() => CatCategory, {onDelete: 'RESTRICT'})
  category: CatCategory

  @Column
  sortIndex: number

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog


}
