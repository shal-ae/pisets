import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript'
import {CatCategory} from './category.entity'
import {TABLE_NAME_CATEGORY_CONNECTED} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_CATEGORY_CONNECTED, timestamps: false,
  indexes: [
    {name: 'cat_category_connected', unique: true, fields: ['category1id', 'category2id']},
  ],
})
export class CatCategoryCategory extends Model {

  @ForeignKey(() => CatCategory)
  @Column({type: DataType.INTEGER, allowNull: false})
  category1id: number

  @BelongsTo(() => CatCategory, {onDelete: 'CASCADE'})
  category1: CatCategory

  @ForeignKey(() => CatCategory)
  @Column({type: DataType.INTEGER, allowNull: false})
  category2id: number

  @BelongsTo(() => CatCategory, {onDelete: 'CASCADE'})
  category2: CatCategory

}
