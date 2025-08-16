import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'
import { TABLE_NAME_USER } from '../../database/database.const'
import { MyModelTimestamps } from '../../shared/types/my-model-timestamps'
import { Company } from './company.entity'

@Table( {
  tableName: TABLE_NAME_USER,
  indexes: [
    { name: 'user_email_unique', fields: [ 'email' ], unique: true },
    { name: 'user_company_name', fields: [ 'companyId', 'name' ], unique: false },
    {
      name: 'user_company_email',
      fields: [ 'companyId', 'email' ],
      unique: false,
    },
    {
      name: 'user_company_created',
      fields: [ 'companyId', 'createdAt' ],
      unique: false,
    },
  ],
} )
export class User extends MyModelTimestamps {
  @ForeignKey( () => Company )
  @Column( { type: DataType.INTEGER, allowNull: false } )
  companyId: number

  @BelongsTo( () => Company, { onDelete: 'RESTRICT' } )
  company: Company

  @Column( { type: DataType.STRING, allowNull: false } )
  email: string

  @Column
  password: string

  @Column( { type: DataType.STRING, allowNull: false } )
  name: string

  @Column( { type: DataType.JSONB } )
  access: UserAccess

  @Column( { type: DataType.JSONB } )
  settings: UserSettings

  @Column
  twoFactorAuthenticationSecret: string

  @Column
  isTwoFactorAuthenticationEnabled: boolean

  @Column
  useOtpOnly: boolean
}

export type UserSettings = {
  notifications?: {
    emailOnNewDoc4s?: boolean;
    emailOnDocApproveResult?: boolean;
  };
};

export type UserAccess = {
  isSystemAdmin?: boolean;
  isCompanyAdmin?: boolean;
  canSignDocuments?: boolean;
  canListAll?: boolean;
};

export const UserFullAccess: UserAccess = {
  isSystemAdmin: true,
  isCompanyAdmin: true,
  canSignDocuments: true,
  canListAll: true,
}
