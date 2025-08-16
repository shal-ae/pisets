import {Column, Table} from 'sequelize-typescript'
import {CatProductIdxBaseModel} from './abstract/product-idx-base-model'

@Table({
    tableName: 'cat__product_idx_product',
    timestamps: false,
    indexes: [
      {fields: ['catalogId'], unique: false},
      {fields: ['productId'], unique: true},
      {fields: ['parentId'], unique: false},
      {fields: ['article'], unique: false},
      {fields: ['name'], unique: false},
      {fields: ['priceDealer', 'parentId'], unique: false},
      {fields: ['priceRetail', 'parentId'], unique: false},
      {fields: ['outdated', 'article'], unique: false},
      {fields: ['outdated', 'name'], unique: false},
      {fields: ['outdated', 'priceDealer', 'parentId'], unique: false},
      {fields: ['outdated', 'priceRetail', 'parentId'], unique: false},
    ],
  },
)
export class CatProductIdxProduct extends CatProductIdxBaseModel {
  @Column
  parentId: number

  @Column
  sortIndex: number
}
