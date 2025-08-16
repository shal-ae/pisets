import { InjectionToken } from '@nestjs/common'
import { S3ConnectionConfig } from './s3.types'

export interface S3ModuleConfig {
  connections: S3ConnectionConfig[]
}

export const S3_MODULE_CONFIG_TOKEN: InjectionToken<S3ModuleConfig> = 'S3ModuleConfig'

