import { DbModuleConfig } from 'libs/back/core/db/src'
import { Doc4s } from '../doc4s/entities/doc4s.entity'
import { Stamp } from '../stamp/entities/stamp.entity'
import { Company } from '../users/entities/company.entity'
import { User } from '../users/entities/user.entity'

export const DB_MODULE_CONFIG: DbModuleConfig = {
  models: [
    User,
    Company,
    Stamp,
    Doc4s,
  ],
  sequelizeOptions: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    dialect: 'postgres',
    logging: process.env.DATABASE_LOG === '1',
  },
}
