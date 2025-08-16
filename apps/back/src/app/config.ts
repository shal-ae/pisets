import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface'
import * as process from 'process'


export const MAILER_JOB_TTL = 60 * 60 * 24 * 7
export const PDF_JOB_TTL = 60 * 60 * 24 * 7

export const API_PORT = +process.env.API_PORT

export const API_CORS: boolean | CorsOptions | CorsOptionsDelegate<any> =
  process.env.API_CORS_DISABLED === '1'
    ? true
    : {
      origin: process.env.API_CORS.split( ';' ),
    }

/** DEFAULT ADMIN  */
export const DEFAULT_EMAIL = process.env.ADMIN_DEFAULT_EMAIL.trim()
export const DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD.trim()

export const FILES_PATH = process.env.FILES_PATH || 'data/files'
export const TEMP_FILES_PATH = process.env.TEMP_FILES_PATH || 'temp'

export const MAILER_TRANSPORT = process.env.MAILER_TRANSPORT
export const MAILER_FROM = process.env.MAILER_FROM
export const BASE_FRONTEND_URL =
  process.env.BASE_FRONTEND_URL || 'http://p.rk-a.ru'


export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = +(process.env.REDIS_PORT || 6379)
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD

export const SERVICE_NAME = process.env.SERVICE_NAME || 'pisets.ru'


// export const BACKEND_URL_FILES_PREFIX = process.env.BACKEND_URL_FILES_PREFIX || 'http://p.rk-a.ru/files/private/';
//
// export const AWS_REGION = process.env.AWS_REGION;
// export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
// export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
// export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
//
// export const S3_SIGNED_URL_TTL = +(process.env.S3_SIGNED_URL_TTL || 60);
