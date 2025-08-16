import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface'
import * as process from 'process'
import { ServerConfig } from './server-config.types'

export const PUBLIC_FILES_PATH = process.env[ 'PUBLIC_FILES_PATH' ] || 'data/erp/public'

export const PRIVATE_FILES_PATH = process.env[ 'PRIVATE_FILES_PATH' ] || 'data/erp/private'

export const ERP_FILES_PATH = process.env[ 'ERP_FILES_PATH' ] || 'data/erp/erp'

export const TEMP_FILES_PATH = process.env[ 'TEMP_FILES_PATH' ] || 'data/erp/temp'

/** MAIN  SERVER  CONFIG  */
export const SERVER_CONFIG: ServerConfig = {
  isCloudServer: process.env[ 'SERVER_THIS_IS_A_CLOUD_SERVER' ] === '1',
  useCloudServer: process.env[ 'SERVER_USE_CLOUD_SERVER' ] === '1',
  cloudServerBaseUrl: process.env[ 'SERVER_CLOUD_SERVER_BASE_URL' ] ?? '',
  downloadPicturesAndFilesFromCloudServer: process.env[ 'SERVER_DOWNLOAD_FILES_FROM_SERVER' ] === '1',
}

/** DEFAULT ADMIN  */
export const DEFAULT_USERNAME = (process.env[ 'ADMIN_DEFAULT_USERNAME' ] ?? '').trim()
export const DEFAULT_PASSWORD = (process.env[ 'ADMIN_DEFAULT_PASSWORD' ] ?? '').trim()

export const API_PORT = +(process.env[ 'API_PORT' ] ?? 0)

export const API_CORS: boolean | CorsOptions | CorsOptionsDelegate<any> =
  process.env[ 'API_CORS_DISABLED' ] === '1' ? true :
    {
      origin: ((process.env[ 'API_CORS' ] ?? '')).split( ';' ),
    }


/** LOADER sends info to messenger */
export const SOCKET_ADDRESS = process.env[ 'LOADER_ADDRESS_TO_SEND_LOADING_PROGRESS_TO' ]


/** MESSENGER server  */
export const PORT_SOCKET_MESSENGER = +(process.env[ 'MESSENGER_PORT_SOCKET' ] ?? 0)
export const PORT_WEB_MESSENGER = +(process.env[ 'MESSENGER_PORT_WEB' ] ?? 0)

export const CORS_SOCKET_MESSENGER: boolean | CorsOptions | CorsOptionsDelegate<any>
  = process.env[ 'MESSENGER_CORS_DISABLED' ] === '1' ? true :
  {
    origin: (process.env[ 'MESSENGER_CORS' ] ?? '').split( ';' ),
  }

export const DELAY_MS_BEFORE_DOWNLOAD_DATA_FILE_FROM_CLOUD_SERVER = +(process.env[ 'DELAY_MS_BEFORE_DOWNLOAD_DATA_FILE_FROM_CLOUD_SERVER' ] || '300')

export const API_ADDRESS_1C = process.env[ 'API_ADDRESS_1C' ] || 'localhost'

