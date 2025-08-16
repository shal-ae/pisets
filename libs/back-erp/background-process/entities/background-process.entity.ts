import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript'
import {TABLE_NAME_BACKGROUND_PROCESS} from '../types/background-process.types'
import {CatCatalog} from '../../cat/entities/catalog.entity'
import {MyModelTimestamps} from '../../db/models/my-model-timestamps'
import {Schedule} from '../../types/schedule.types';

@Table({
  tableName: TABLE_NAME_BACKGROUND_PROCESS,
  indexes: [
    {name: 'sys_background_process_unique', fields: ['code'], unique: true},
  ],
})
export class SysBackgroundProcess extends MyModelTimestamps {
  @Column
  name: string

  @ForeignKey(() => CatCatalog)
  @Column({type: DataType.INTEGER, allowNull: false})
  catalogId: number

  @BelongsTo(() => CatCatalog, {onDelete: 'CASCADE'})
  catalog: CatCatalog

  @Column
  code: string

  // @Column({type: DataType.ENUM, allowNull: true, values: Object.values(SysProcessType)})
  // type: SysProcessType

  @Column({allowNull: true})
  type: string

//  глюк в Postgres - не работает с ENUM --->  SysProcessStatus
  @Column({type: DataType.STRING(20), allowNull: true})
  status: string

  @Column
  statusSince: Date

  @Column
  useSchedule: boolean

  @Column({type: DataType.JSONB})
  schedule: Schedule

  @Column
  lastTickAt: Date

  @Column({type: DataType.TEXT})
  tickMessage: string

  @Column
  tickCount: number

  @Column
  lastDoneTickTotal: number

  @Column
  lastDoneAt: Date // success finish

  @Column
  startAt: Date

  @Column
  endAt: Date

//  глюк в Postgres - не работает с ENUM --->  SysProcessEndReason
  @Column({type: DataType.STRING(20), allowNull: true})
  endReason: string

  @Column({type: DataType.TEXT})
  endMessage: string

  // @Column
  // result: string

  @Column({type: DataType.JSONB})
  startParams: any

  @Column({type: DataType.JSONB})
  processResult: any

}


/**
 *
 ALTER TABLE sys__background_process ADD COLUMN fld VARCHAR(255);
 update sys__background_process SET fld = "type";
 ALTER TABLE sys__background_process DROP COLUMN "type" ;
 ALTER TABLE sys__background_process RENAME COLUMN fld TO "type" ;
 *
 */
