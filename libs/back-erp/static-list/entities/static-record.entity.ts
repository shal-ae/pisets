import {MyModelTimestamps} from '@app/back/db/models/my-model-timestamps';
import {Column, DataType, Table} from 'sequelize-typescript';
import {TABLE_NAME_STATIC_LIST} from '../types/static-list.types';

@Table({
  tableName: TABLE_NAME_STATIC_LIST,
  indexes: [
    {name: 'static__key_unique', fields: ['key'], unique: true},
    {name: 'static__group_sort', fields: ['group', 'sortIndex']},
  ],
})
export class StaticRecord extends MyModelTimestamps {
  @Column({type: DataType.INTEGER})
  sortIndex: number

  @Column({type: DataType.BOOLEAN, allowNull: false})
  deleted: boolean

  @Column({type: DataType.STRING, allowNull: false})
  group: string

  @Column({type: DataType.STRING})
  key: string

  @Column({type: DataType.JSONB})
  data: any
}
