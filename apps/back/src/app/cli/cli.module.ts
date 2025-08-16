import { RedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { DB_MODULE_CONFIG } from '../database/db-module.config'
import { JOB_MODULE_CONFIG } from '../job/job-module.config'
import { MailModule } from '../mail/mail.module'
import { UserService } from '../users/services/user.service'
import { UsersModule } from '../users/users.module'
import { CliService } from './cli.service'
import { DbModule, ListService } from '@rka/db';
import { JobModule } from '@rka/job-back';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config';

@Module( {
  imports: [
    DbModule.forRoot( DB_MODULE_CONFIG ),
    JobModule.forRoot( JOB_MODULE_CONFIG ),
    MailModule,
    UsersModule,
    RedisModule.forRoot( {
      type: 'single',
      options: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      },
    } ),
  ],
  controllers: [],
  providers: [
    UserService,
    CliService,
    ListService,
  ],
} )
export class CliModule {
}
