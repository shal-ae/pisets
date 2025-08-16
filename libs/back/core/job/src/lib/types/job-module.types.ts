import { InjectionToken } from '@nestjs/common'

export interface RedisConnection {
  host: string;
  port: number;
  password: string;
}

export interface JobConfig {
  redis: RedisConnection
  queueNames: string[]
}

export const JOB_CONFIG_TOKEN: InjectionToken<JobConfig> = 'JobConfig'

