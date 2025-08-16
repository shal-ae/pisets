import {ApiProperty} from '@nestjs/swagger'

export class ListServiceFilterData {
  @ApiProperty({
    description: 'Если указаны ИД, общее количество не считаем и другие условия не учитываются',
    required: false,
    type: Number,
    isArray: true,
  })
  ids?: number[] | null = null

  @ApiProperty({description: 'Считать общее количество', required: false, default: true, type: Boolean})
  countTotal? = true

  @ApiProperty({description: 'Число элементов на странице', required: false, default: 100, type: Number})
  limit = 100

  @ApiProperty({description: 'Смещение от начала', required: false, default: 0, type: Number})
  offset = 0

  @ApiProperty({
    type: String,
    description: 'SQL order: name DESC, id...',
    required: false,
    default: '',
  })
  order = ''

}

export class ListDTO<T> {
  @ApiProperty({type: Number, description: 'Общее количество записей по текущему фильтру'})
  total: number | null

  @ApiProperty({type: Array, description: 'Массив данных'})
  data: T[]
}
