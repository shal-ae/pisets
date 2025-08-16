import { ApiProperty } from '@nestjs/swagger'

export class ListQueryParams {
  @ApiProperty( {
    description: 'Если нужен фильтр, то можно указать "where ...."',
  } )
  whereClause?: string

  @ApiProperty( {
    description: 'Если нужна сортировка, то можно указать "order by id desc"',
  } )
  orderByClause?: string

  @ApiProperty( { description: 'Смещение в выборке' } )
  offset?: number

  @ApiProperty( { description: 'Ограничение выборки по количеству' } )
  limit?: number

  @ApiProperty( { description: 'True - посчитать общее количество' } )
  countTotal?: boolean
}

export type ListServiceQueryParams = ListQueryParams & {
  tableName: string;
  columns?: string;
};

export class ListDTO<T> {
  @ApiProperty( {
    type: Number,
    description: 'Общее количество записей по текущему фильтру',
  } )
  total: number | null

  @ApiProperty( { type: Array, description: 'Массив данных' } )
  data: T[]
}
