import { Column, DataType, Table } from 'sequelize-typescript'
import { TABLE_NAME_COMPANY } from '../../database/database.const'
import { MyModelTimestamps } from '../../shared/types/my-model-timestamps'

@Table( {
  tableName: TABLE_NAME_COMPANY,
} )
export class Company extends MyModelTimestamps {
  @Column( { type: DataType.STRING, allowNull: false } )
  name: string

  @Column( { type: DataType.STRING( 8 ), allowNull: false } )
  code: string
}
