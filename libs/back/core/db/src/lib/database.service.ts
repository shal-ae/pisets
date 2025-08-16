import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { SEQUELIZE } from './database.providers'

@Injectable()
export class DatabaseService {
  constructor( @Inject( SEQUELIZE ) public readonly sequelize: Sequelize ) {
  }
}
