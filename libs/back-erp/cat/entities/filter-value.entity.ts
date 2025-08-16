import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'
import { CatCatalog } from './catalog.entity'
import { CatFilter } from './filter.entity'
import { ApiProperty } from '@nestjs/swagger'
import { MyModelOutdatedTimestamps } from '../../db/models/my-model-outdated-timestamps'
import { TABLE_NAME_FILTER_VALUE } from '../types/cat.tables'

@Table( {
  tableName: TABLE_NAME_FILTER_VALUE,
  indexes: [
    {name: 'UNQ_FilterValue__Code', fields: [ 'filterId', 'catalogCode' ], unique: true},
    {name: 'IDX_FilterValue__Cat', fields: [ 'catalogId' ]},
  ],
} )
export class CatFilterValue extends MyModelOutdatedTimestamps {
  @ForeignKey( () => CatFilter )
  @Column( {type: DataType.INTEGER, allowNull: false} )
  filterId: number

  @BelongsTo( () => CatFilter, {onDelete: 'CASCADE'} )
  filter: CatFilter

  @Column( {type: DataType.STRING( 150 ), allowNull: false} )
  catalogCode: string

  @ForeignKey( () => CatCatalog )
  @Column( {type: DataType.INTEGER, allowNull: false} )
  catalogId: number

  @BelongsTo( () => CatCatalog, {onDelete: 'CASCADE'} )
  catalog: CatCatalog


  @Column
  sortIndex: number

  @Column
  name: string

  @ApiProperty( {description: 'Элемент не нужно связывать с общим каталогом'} )
  @Column
  doNotConnectToCommon: boolean

  @ApiProperty( {description: 'Число использований раздела. Вычисляется отдельной работой'} )
  @Column
  useCount: number

  @ApiProperty( {description: 'Данные иконки в произвольном формате'} )
  @Column( {type: DataType.JSONB} )
  icon: any

  @ApiProperty( {description: 'На сайте не отображать'} )
  @Column
  hiddenForSite: boolean

  connectedIds: number[]
  connectTo?: number
}


