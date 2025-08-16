import {Table} from 'sequelize-typescript'
import {CatProductIdxFilterBase} from './abstract/product-idx-filter-base-model'

@Table({
  tableName: 'cat__product_idx_product_category',
  timestamps: false,
  indexes: [
    {fields: ['catalogId'], unique: false},
    {fields: ['filterId', 'productId'], unique: true},
  ],
})
export class CatProductIdxProductCategory extends CatProductIdxFilterBase {

}
