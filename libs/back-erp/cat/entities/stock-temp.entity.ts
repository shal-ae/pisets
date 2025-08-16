import {StockFieldsModel} from './product-idx/abstract/stock-fields-model'
import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {CatProduct} from './product.entity'

@Table({
  tableName: 'cat__stock_temp',
  timestamps: false,
  indexes: [
    {name: 'UNQ_StockTemp__product', fields: ['productId'], unique: true},
    {name: 'IDX_StockTemp__catalog', fields: ['catalogId']},
  ],
})
export class CatStockTemp extends StockFieldsModel {

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @ForeignKey(() => CatProduct)
  @Column({type: DataType.INTEGER, allowNull: false})
  productId: number

  @BelongsTo(() => CatProduct, {onDelete: 'CASCADE'})
  product: CatProduct

}
