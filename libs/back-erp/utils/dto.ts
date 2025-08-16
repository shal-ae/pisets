import {ApiProperty} from '@nestjs/swagger'

export class BaseDTO {
  @ApiProperty({type: Number, description: 'item id'})
  id: number

  @ApiProperty({type: Date, description: 'Item created datetime'})
  createdAt: Date

  @ApiProperty({type: Date, description: 'Item updated datetime'})
  updatedAt: Date
}

export class OutdatedDTO extends BaseDTO {
  @ApiProperty({description: 'Перед загрузкой устанавливаем на true, при загрузке элемента = false. После загрузки элементов данные переносятся в поле outdated'})
  outdatedForLoading: boolean

  @ApiProperty({description: 'Если true - Элемента нет в выгрузке'})
  outdated: boolean
}

export class SortOutdatedDTO extends OutdatedDTO {
  @ApiProperty({description: 'Порядок сортировки, начиная с 1. Возможно NULL'})
  sortIndex: number
}
