import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript'
import {CatCatalog} from './catalog.entity'
import {TABLE_NAME_BROKEN_LINK} from '../types/cat.tables'

@Table({
  tableName: TABLE_NAME_BROKEN_LINK,
  timestamps: true,
  indexes: [
    {name: 'cat_br_file__src_catalog', unique: true, fields: ['sourcePath', 'catalogId']},
  ],
})
export class CatBrokenLink extends Model {
  @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true})
  id: number

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @Column({type: DataType.STRING(500), allowNull: false})
  sourcePath: string

  @Column
  downloadMessage: string

  @Column
  downloadCode: number

}

