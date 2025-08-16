import { DynamicModule, Module } from '@nestjs/common'
import { S3Service } from './services/s3.service'
import { S3_MODULE_CONFIG_TOKEN, S3ModuleConfig } from './types/s3-module.types'

/**
 * A module for integrating with S3 compatible service.
 * This module provides a dynamic way to configure and use the S3Service.
 *
 * @module S3Module
 */
@Module( {} )
export class S3Module {

  /**
   * A static method for creating a dynamic module with the provided configuration.
   * This method is used to set up the S3Module with the given configuration and make it available for injection.
   *
   * @static
   * @param {S3ModuleConfig} config - The configuration object for the S3Module.
   * @returns {DynamicModule} - A dynamic module with the provided configuration and S3Service.
   *
   * @example
   * ```typescript
   *
   *
   * @Module({
   *   imports: [
   *     S3Module.forRoot({
   *        connections: [{
   *          name: ''
   *          endpoint: 'https://storage.yandexcloud.net',
   *          region: 'your_region',
   *          accessKey: 'your_access_key_id',
   *          secretKey: 'your_secret_access_key',
   *          bucket: 'your_bucket_name'
   *        }],
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot( config: S3ModuleConfig ): DynamicModule {
    return {
      global: true,
      module: S3Module,
      imports: [],
      providers: [
        {
          provide: S3_MODULE_CONFIG_TOKEN,
          useValue: config,
        },
        S3Service,
      ],
      exports: [
        S3Service,
      ],
    }
  }
}
