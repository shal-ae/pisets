import { DynamicModule, Global, Module } from '@nestjs/common'
import { getDatabaseProviders } from './database.providers'
import { DatabaseService } from './database.service'
import { ListService } from './list-service/list.service'
import { DbModuleConfig } from './types/db-module.types'

@Global()
@Module( {} )
export class DbModule {
  static async forRoot( config: DbModuleConfig ): Promise<DynamicModule> {
    console.log( config.sequelizeOptions )
    const dbProviders = await getDatabaseProviders( config.models, config.sequelizeOptions )
    return {
      module: this,
      global: true,
      providers: [ ...dbProviders, DatabaseService, ListService ],
      exports: [ ...dbProviders, DatabaseService, ListService ],
    }
  }
}
