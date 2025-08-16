import { ApiProperty } from '@nestjs/swagger'

export class ApiResult<T> {
  @ApiProperty( { description: 'Операция выполнена успешно' } )
  success: boolean

  @ApiProperty( { description: 'Данные' } )
  payload: T

  @ApiProperty( { description: 'Сообщение пользователю в случае ошибки' } )
  userMessage: string

  @ApiProperty( { description: 'Код ошибки' } )
  errorCode: number

  @ApiProperty( { description: 'Объект ошибки', required: false } )
  error?: any

  @ApiProperty( { description: 'Класс объекта ошибки', required: false } )
  errorClass?: string

  @ApiProperty( { description: 'Время выполнения запроса, мс', required: false } )
  requestTime?: number
}