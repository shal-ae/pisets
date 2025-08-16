import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {ApiProperty} from '@nestjs/swagger'
import {MyModelOutdatedTimestamps} from '../../db/models/my-model-outdated-timestamps'
import {TABLE_NAME_SPECIFICATION} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_SPECIFICATION,
  indexes: [
    {name: 'unq_cat_specification__catalogCode', fields: ['catalogCode', 'catalogId'], unique: true},
  ],
})
export class CatSpecification extends MyModelOutdatedTimestamps {
  @Column({type: DataType.STRING(150), allowNull: false})
  catalogCode: string

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @Column
  sortIndex: number

  @Column
  name: string


  @ApiProperty({description: 'Скрытый для всех или системный - не показывать пользователям, в КП, на сайте'})
  @Column
  hidden: boolean

  @ApiProperty({description: 'Значения выводить по размерам (даже если у всех размеров одинаково)'})
  @Column
  forSizes: boolean

  @ApiProperty({description: 'Комментарий'})
  @Column({type: DataType.TEXT})
  comment: string

  @ApiProperty({description: 'Единицы измерения'})
  @Column({type: DataType.STRING(30)})
  dim: string

  @ApiProperty({description: 'Сортировка в КП'})
  @Column
  sortIndexForOffers: number

  @ApiProperty({description: 'Новый. Добавлен поставщиком. Возможно, требует настройки.'})
  @Column
  new: boolean

  @ApiProperty({description: 'TS скрипт вычисления и форматирования значения для КП'})
  @Column({type: DataType.TEXT})
  scriptValueForOffers: string

  @ApiProperty({description: 'Показывать в КП'})
  @Column
  showInOffers: boolean

  @ApiProperty({description: 'Использовать другое наименование в КП'})
  @Column
  nameForOffers: string

  @ApiProperty({description: 'Запускать расчет для всех продуктов, независимо от того, есть ли _значения_ спецификаций'})
  @Column
  calculateForAllProducts: boolean

  @ApiProperty({description: 'Запускать расчет для всех продуктов с размерами, независимо от того, есть ли _значения_ спецификаций'})
  @Column
  calculateForAllProductsWithSizes: boolean

  @ApiProperty({description: 'Ручное редактирование. Не удаляется при загрузке данных от поставщика'})
  @Column
  manual: boolean
  
}

