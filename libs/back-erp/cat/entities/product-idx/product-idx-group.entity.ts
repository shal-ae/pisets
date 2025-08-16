import {Table} from 'sequelize-typescript'
import {CatProductIdxBaseModel} from './abstract/product-idx-base-model'

@Table({
  tableName: 'cat__product_idx_group',
  timestamps: false,
  indexes: [
    {fields: ['catalogId'], unique: false},
    {fields: ['productId'], unique: true},
    {fields: ['article'], unique: false},
    {fields: ['name'], unique: false},
    {fields: ['priceDealer'], unique: false},
    {fields: ['priceRetail'], unique: false},
    {fields: ['outdated', 'article'], unique: false},
    {fields: ['outdated', 'name'], unique: false},
    {fields: ['outdated', 'priceDealer'], unique: false},
    {fields: ['outdated', 'priceRetail'], unique: false},
    {fields: ['created', 'priceDealer'], unique: false},
    {fields: ['outdated', 'created', 'priceDealer'], unique: false},
  ],
})
export class CatProductIdxGroup extends CatProductIdxBaseModel {
}
