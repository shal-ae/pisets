import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'
import { TABLE_NAME_DOC4S } from '../../database/database.const'
import { MyModelTimestamps } from '../../shared/types/my-model-timestamps'
import { Company } from '../../users/entities/company.entity'
import { User } from '../../users/entities/user.entity'
import { DocumentForSignature } from '../types/doc4s.types'

@Table( {
  tableName: TABLE_NAME_DOC4S,
  indexes: [
    {
      name: 'doc4s_company_created',
      fields: [ 'companyId', 'createdAt' ],
      unique: false,
    },
    {
      name: 'doc4s_company_updated',
      fields: [ 'companyId', 'updatedAt' ],
      unique: false,
    },
  ],
} )
export class Doc4s extends MyModelTimestamps {
  @ForeignKey( () => Company )
  @Column( { type: DataType.INTEGER, allowNull: false } )
  companyId: number

  @BelongsTo( () => Company, { onDelete: 'RESTRICT' } )
  company: Company

  @Column( { type: DataType.JSONB } )
  data: DocumentForSignature

  @ForeignKey( () => User )
  @Column( { type: DataType.INTEGER, allowNull: false } )
  authorId: number

  @BelongsTo( () => User, { onDelete: 'RESTRICT' } )
  author: User

  @ForeignKey( () => User )
  @Column( { type: DataType.INTEGER, allowNull: true } )
  assignedByUserId: number

  @Column
  subject: string

  @Column( { type: DataType.TEXT } )
  description: string

  @Column
  type: string

  @Column( { type: DataType.STRING( 40 ) } )
  incomingDocumentNumber: string

  @Column
  incomingDocumentDate: Date

  @Column
  counterparty: string

  @Column( { type: DataType.STRING( 30 ) } )
  status: string
}
