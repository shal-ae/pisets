import { AppConfig } from './app-config.types'

export const Environment: AppConfig = {
  apiAddress: 'https://pisets.ru',
  ssrApiAddress: 'http://api_doc',
  refreshTokenIntervalSec: 600,

  // not Used
  apiAddressErp: '',
  localErpFilesBackend: '',
}

// Для докальной разработки
//
// export const Environment: EnvironmentConfig = {
//   apiAddress: 'http://localhost:3040',
//   ssrApiAddress: 'http://localhost:3040',
//   refreshTokenIntervalSec: 600,
//   documentViewThumbnailSize: 1500,
//
//   // not Used
//   apiAddressErp: '',
//   localErpFilesBackend: '',
// }
