import {Column, DataType} from 'sequelize-typescript'
import {MyModelOutdated} from '../../../../db/models/my-model-outdated'


export class StockFieldsModel extends MyModelOutdated {
  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockLocalFree: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockLocalReserve: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockLocalTotal: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockCatalogFree: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockCatalogReserve: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockCatalogTotal: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  inWayCatalogFree: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  inWayCatalogReserve: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  inWayCatalogTotal: number

}

export class StockFieldsPlusModel extends StockFieldsModel {

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockPlusInWayCatalogFree: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockPlusInWayCatalogReserve: number

  @Column({type: DataType.INTEGER, defaultValue: 0, allowNull: false})
  stockPlusInWayCatalogTotal: number
}
