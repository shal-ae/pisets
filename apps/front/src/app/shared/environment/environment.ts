import { AppConfig } from './app-config.types'

export const Environment: AppConfig = {
  apiAddress: 'http://localhost:3040',
  ssrApiAddress: 'http://localhost:3040',
  refreshTokenIntervalSec: 30,

  // not Used
  apiAddressErp: 'http://localhost:3020',
  localErpFilesBackend: 'http://localhost:3020/files-erp',
}
