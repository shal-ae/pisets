import {Column, DataType, Model, Table} from 'sequelize-typescript'
import {TABLE_NAME_CATALOG} from '../types/cat.tables';

@Table({tableName: TABLE_NAME_CATALOG, timestamps: false})
export class CatCatalog extends Model {
  @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true})
  id: number

  @Column
  sortIndex: number

  @Column
  name: string

  @Column
  code: string

  @Column
  type: string

  @Column
  site: string

  @Column({type: DataType.TEXT})
  connectionParams: string

  @Column
  productDataDownloadedAt: Date

  @Column
  productDataActualAt: Date

  @Column
  stockDataDownloadedAt: Date

  @Column
  stockDataActualAt: Date

  @Column
  common: boolean

  @Column({type: DataType.JSONB})
  statistic: any

  @Column
  cloudCatalogId: string

  @Column({type: DataType.JSONB})
  icon: any


}
