import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {MyModelOutdated} from '../../db/models/my-model-outdated'
import {CatProduct} from './product.entity'
import {CatSpecification} from './specification.entity'
import {ApiProperty} from '@nestjs/swagger'
import {TABLE_NAME_PRODUCT_SPECIFICATION} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_PRODUCT_SPECIFICATION,
  timestamps: false,
  indexes: [
    {name: 'UNQ_Product__cat_Pr_Sp', fields: ['productId', 'specificationId'], unique: true},
    {name: 'IDX_Product__cat_Pr_Sp__cat', fields: ['catalogId']},
  ],
})
export class CatProductSpecification extends MyModelOutdated {
  @ForeignKey(() => CatProduct)
  @Column({type: DataType.INTEGER, allowNull: false})
  productId: number

  @BelongsTo(() => CatProduct, {onDelete: 'CASCADE'})
  product: CatProduct

  @ForeignKey(() => CatSpecification)
  @Column({type: DataType.INTEGER, allowNull: false})
  specificationId: number

  @BelongsTo(() => CatSpecification, {onDelete: 'RESTRICT'})
  specification: CatSpecification

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @Column
  sortIndex: number

  @ApiProperty({description: 'Значение от поставщика'})
  @Column({type: DataType.TEXT})
  value: string

  @ApiProperty({description: 'Значение для КП'})
  @Column({type: DataType.TEXT})
  valueForOffers: string

  @Column
  equalToParentValue: boolean

}
