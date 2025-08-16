import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatProductType, PRODUCT_FILE_LOCAL_PATH_LENGTH} from '../types/product.types'
import {CatCatalog} from './catalog.entity'
import {ApiProperty} from '@nestjs/swagger'
import {MyModelOutdatedTimestamps} from '../../db/models/my-model-outdated-timestamps'
import {CatDiscountGroup} from './discount-group.entity'
import {TABLE_NAME_PRODUCT} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_PRODUCT,
  indexes: [
    {name: 'UNQ_Product__cat_code', fields: ['catalogCode', 'catalogId'], unique: true},
    {name: 'IDX_Product__cat_GroupCode', fields: ['catalogId', 'catalogGroupCode']},
    {name: 'IDX_Product__article', fields: ['article']},
    {name: 'IDX_Product__parent', fields: ['parentId']},
  ],
})
export class CatProduct extends MyModelOutdatedTimestamps {
  @Column({type: DataType.STRING(50), allowNull: true})
  catalogCode: string

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog


  @Column
  sortIndex: number

  /** Код только для загрузки групп Gifts.ru   */
  @Column({type: DataType.STRING(30)})
  catalogGroupCode: string

  // @Column({type: DataType.STRING(50)})
  // catalogParentCode: string
  //
  // @Column({type: DataType.STRING(20)})
  // catalogParentSizeCode: string

  @Column
  name: string

  @Column
  size: string

  @Column({type: DataType.INTEGER})
  type: CatProductType

  @ForeignKey(() => CatDiscountGroup)
  @Column({type: DataType.INTEGER})
  discountGroupId: number

  @BelongsTo(() => CatDiscountGroup, {onDelete: 'RESTRICT'})
  discountGroup: CatDiscountGroup

  @ForeignKey(() => CatProduct)
  @Column({type: DataType.INTEGER})
  parentId: number

  @BelongsTo(() => CatProduct, {onDelete: 'RESTRICT'})
  parent: CatProduct


  @ApiProperty({description: 'код в нашей 1С'})
  @Column({type: DataType.STRING(20)})
  baseId: string

  @Column({type: DataType.STRING(40)})
  article: string

  @Column({type: DataType.TEXT})
  description: string


  /* Stock --------------------------------------------------------------------------------*/
  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockLocalFree: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockLocalReserve: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockLocalTotal: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockCatalogFree: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockCatalogReserve: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockCatalogTotal: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  inWayCatalogFree: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  inWayCatalogReserve: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  inWayCatalogTotal: number
  /* Stock --------------------------------------------------------------------------------*/


  @Column({type: DataType.DECIMAL(10, 2)})
  priceRetail: number

  @Column({type: DataType.DECIMAL(10, 2)})
  priceRetailChildrenMax: number

  @Column({type: DataType.DECIMAL(10, 2)})
  priceDealer: number

  @Column({type: DataType.DECIMAL(10, 2)})
  priceDealerChildrenMax: number


  @ApiProperty({description: 'Не поставляется'})
  @Column
  stopped: boolean

  @ApiProperty({description: 'Первая загруженная картинка (для товаров и товаров с размерами)'})
  @Column({type: DataType.STRING(PRODUCT_FILE_LOCAL_PATH_LENGTH)})
  picture: string

  @ApiProperty({description: 'Все загруженные картинки через запятую (для товаров и товаров с размерами)'})
  @Column({type: DataType.TEXT, allowNull: true})
  allDownloadedPictures: string
}

