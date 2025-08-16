import { Inject, Injectable } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { FILES_CONFIG_TOKEN, FilesModuleConfig } from '../types/files-module.types'

@Injectable()
export class UploadToTempDirInterceptorProvider {
  constructor( @Inject( FILES_CONFIG_TOKEN ) private config: FilesModuleConfig ) {
  }

  createInterceptor(): any {
    return new (FileInterceptor( 'file', {
      storage: diskStorage( {
        destination: this.config.tempDir,
      } ),
    } ))
  }
}
