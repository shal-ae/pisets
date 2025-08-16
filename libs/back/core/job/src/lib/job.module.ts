import { RedisModule } from '@nestjs-modules/ioredis'
import { BullModule } from '@nestjs/bullmq'
import { DynamicModule, Module } from '@nestjs/common'
import { JobController } from './controllers/job.controller'
import { ConfirmService } from './services/confirm.service'
import { JobService } from './services/job.service'
import { JOB_CONFIG_TOKEN, JobConfig } from './types/job-module.types'

@Module( {} )
export class JobModule {
  static forRoot( config: JobConfig ): DynamicModule {
    console.log( config )
    return {
      global: true,
      module: this,
      imports: [
        RedisModule.forRoot( {
          type: 'single',
          options: {
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
          },
        } ),
        BullModule.forRoot( {
            connection: {
              host: config.redis.host,
              port: config.redis.port,
              password: config.redis.password,
            },
          },
        ),
        BullModule.registerQueue( ...config.queueNames.map( e => ({ name: e }) ) ),
      ],
      controllers: [
        JobController,
      ],
      providers: [
        {
          provide: JOB_CONFIG_TOKEN,
          useValue: config,
        },
        JobService,
        ConfirmService,
      ],
      exports: [
        JobService,
        ConfirmService,
        BullModule,
        RedisModule,
      ],
    }
  }
}
