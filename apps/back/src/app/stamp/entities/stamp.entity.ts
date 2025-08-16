import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'
import { TABLE_NAME_STAMP } from '../../database/database.const'
import { MyModelTimestamps } from '../../shared/types/my-model-timestamps'
import { Company } from '../../users/entities/company.entity'
import { StampData } from '../types/stamp.types'

@Table( {
  tableName: TABLE_NAME_STAMP,
  indexes: [
    {
      name: 'stamp_company_sort',
      fields: [ 'companyId', 'sort', 'id' ],
      unique: true,
    },
  ],
} )
export class Stamp extends MyModelTimestamps {
  @Column
  sort: number

  @Column( { type: DataType.JSONB } )
  data: StampData

  @ForeignKey( () => Company )
  @Column( { type: DataType.INTEGER, allowNull: false } )
  companyId: number

  @BelongsTo( () => Company, { onDelete: 'RESTRICT' } )
  company: Company
}
