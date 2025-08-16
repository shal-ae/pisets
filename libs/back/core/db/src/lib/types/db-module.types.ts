import { ModelCtor } from 'sequelize-typescript/dist/model/model/model'
import { SequelizeOptions } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize-options'

export interface DbModuleConfig {
  models: ModelCtor[],
  sequelizeOptions: SequelizeOptions
}
