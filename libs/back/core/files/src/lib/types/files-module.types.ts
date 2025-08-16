import { InjectionToken } from '@nestjs/common'

export interface FilesModuleConfig {
  filesDir: string
  tempDir: string
}

export const FILES_CONFIG_TOKEN: InjectionToken<FilesModuleConfig> = 'FilesConfig'




