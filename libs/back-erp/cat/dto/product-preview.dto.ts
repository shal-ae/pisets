import {ApiProperty} from '@nestjs/swagger';
import {ProductPriceData, ProductStockData} from '../types/product.types';

export class ProductPreviewItemDTO {
  @ApiProperty({description: 'ИД товара'})
  id: number

  @ApiProperty({description: 'ИД родителя товара (группы) или NULL'})
  parentId: number

  @ApiProperty({description: 'Тип - 1. Группа, 2 - Товар, 3 - Товар с размерами, 4 - Размер товара'})
  type: number

  @ApiProperty({description: 'ИД каталога'})
  catalogId: number

  @ApiProperty({description: '0 - товар в продаже, 1 - снят с продаж'})
  stopped: boolean

  @ApiProperty({description: 'Наименование'})
  name: string

  @ApiProperty({description: 'Артикул'})
  article: string

  @ApiProperty({description: 'Путь к первой картинке в папке файлов каталога'})
  picture: string

  @ApiProperty({description: 'Остатки'})
  stock: ProductStockData

  @ApiProperty({description: 'Цены'})
  price: ProductPriceData

  @ApiProperty({
    type: ProductPreviewItemDTO,
    description: 'Вложенные товары (цвета)',
    isArray: true,
    required: false,
  })
  children?: ProductPreviewItemDTO[]

  @ApiProperty({description: 'Элемент удовлетворяет условиям поиска', required: false})
  searchMatch?: boolean
}
