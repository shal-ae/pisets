import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {PRODUCT_FILE_LOCAL_PATH_LENGTH} from '../types/product.types'
import {CatCatalog} from './catalog.entity'
import {MyModelOutdated} from '../../db/models/my-model-outdated'
import {CatProduct} from './product.entity'
import {TABLE_NAME_PRODUCT_FILES} from '../types/cat.tables';

@Table({
  tableName: TABLE_NAME_PRODUCT_FILES,
  timestamps: false,
  indexes: [
    {name: 'UNQ_PrFiles__Pr_Src', fields: ['productId', 'sourcePath'], unique: true},
    // {name: 'UNQ_PrFiles__productId_sortIndex', fields: ['productId', 'type', 'sortIndex'], unique: true},
    {name: 'IDX_PrFiles__Cat', fields: ['catalogId']},
    {name: 'IDX_PrFiles__Cat_hash', fields: ['catalogId', 'localPath']},
    {name: 'IDX_PrFiles__Cat_Src', fields: ['catalogId', 'sourcePath']},
  ],
})
export class CatProductFiles extends MyModelOutdated {
  @ForeignKey(() => CatProduct)
  @Column({type: DataType.INTEGER, allowNull: false})
  productId: number

  @BelongsTo(() => CatProduct, {onDelete: 'CASCADE'})
  product: CatProduct

  @Column({type: DataType.STRING(500), allowNull: false})
  sourcePath: string

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @Column({type: DataType.INTEGER, allowNull: false})
  sortIndex: number

  @Column({allowNull: false})
  type: number

  @Column({type: DataType.STRING(PRODUCT_FILE_LOCAL_PATH_LENGTH)})
  localPath: string

  /**
   temporary for loading existing file data from cloud server,
   1. Fill from JSON file downloaded from cloud
   2. If using cloud - copy to 'hash'
   3. If download from cloud - use for downloading and then copy to 'hash'
   */
  @Column({type: DataType.STRING(PRODUCT_FILE_LOCAL_PATH_LENGTH)})
  localPathCloud: string

  @Column({type: DataType.STRING(50)})
  comment: string

}
