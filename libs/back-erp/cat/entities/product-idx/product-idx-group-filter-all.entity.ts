import {Table} from 'sequelize-typescript'
import {CatProductIdxFilterBase} from './abstract/product-idx-filter-base-model'

@Table({
  tableName: 'cat__product_idx_group_filter_all',
  timestamps: false,
  indexes: [
    {fields: ['catalogId'], unique: false},
    {fields: ['filterId', 'productId'], unique: true},
  ],
})
export class CatProductIdxGroupFilterAll extends CatProductIdxFilterBase {
}
