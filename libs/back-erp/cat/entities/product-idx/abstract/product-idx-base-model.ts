import {ApiProperty} from '@nestjs/swagger'
import {CatProductType, PRODUCT_FILE_LOCAL_PATH_LENGTH} from '../../../types/product.types'
import {StockFieldsPlusModel} from './stock-fields-model'
import {Column, DataType} from 'sequelize-typescript'

export class CatProductIdxBaseModel extends StockFieldsPlusModel {
  @Column
  productId: number

  @Column
  catalogId: number

  @Column
  name: string

  @Column({type: DataType.STRING(40)})
  article: string

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

  @ApiProperty()
  @Column({type: DataType.INTEGER})
  type: CatProductType

  @ApiProperty({description: 'Дата добавления в базу'})
  @Column
  created: Date
}
