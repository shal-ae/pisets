import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'
import { CatCatalog } from './catalog.entity'
import { ApiProperty } from '@nestjs/swagger'
import { MyModelOutdatedTimestamps } from '../../db/models/my-model-outdated-timestamps'
import { TABLE_NAME_CATEGORY } from '../types/cat.tables'

@Table( {
  tableName: TABLE_NAME_CATEGORY,
  indexes: [
    {name: 'unq_cat_category__catalog_catalogCode', fields: [ 'catalogCode', 'catalogId' ], unique: true},
  ],
} )
export class CatCategory extends MyModelOutdatedTimestamps {
  @ForeignKey( () => CatCatalog )
  @Column( {type: DataType.INTEGER, allowNull: false} )
  catalogId: number

  @BelongsTo( () => CatCatalog, {onDelete: 'CASCADE'} )
  catalog: CatCatalog

  @Column( {type: DataType.STRING( 150 ), allowNull: false} )
  catalogCode: string

  @Column
  name: string

  @Column
  sortIndex: number

  @ForeignKey( () => CatCategory )
  @Column( {type: DataType.INTEGER, allowNull: true} )
  parentId: number

  @BelongsTo( () => CatCategory, {onDelete: 'CASCADE'} )
  parent: CatCategory

  @Column( {type: DataType.STRING( 150 )} )
  catalogCodeParent: string


  @ApiProperty( {description: 'Элемент не нужно связывать с общим каталогом'} )
  @Column
  doNotConnectToCommon: boolean

  @ApiProperty( {description: 'Число использований раздела. Вычисляется отдельной работой'} )
  @Column
  useCount: number

  @ApiProperty( {description: 'Имя файла картинки в каталоге \'/images/categories/\''} )
  @Column
  picture: string

  @ApiProperty( {description: 'SLUG для нового сайта'} )
  @Column
  slug: string

  @ApiProperty( {description: 'id категории на старом сайте (https://rk-a.ru/catalog/{id}) '} )
  @Column
  old_id: number

  @ApiProperty( {description: 'На сайте не отображать в меню категорий'} )
  @Column
  hiddenForSite: boolean
}

