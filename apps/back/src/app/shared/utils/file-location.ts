import { FileUtils } from '@rka/back-utils';
import * as path from 'path'
import { FILES_PATH, TEMP_FILES_PATH } from '../../config';

export class FileLocation {
  static getFilePath(): string {
    return path.join( ...FILES_PATH.split( '/' ) )
  }

  static getFilesDir(): string {
    return path.join( FileUtils.getRootPath(), this.getFilePath() )
  }

  static getFilesDirPrivate(): string {
    return path.join( this.getFilesDir(), 'private' )
  }

  static getFilesDirStamps(): string {
    return path.join( this.getFilesDirPrivate(), 'stamps' )
  }

  static getTempFilePath(): string {
    return path.join( ...TEMP_FILES_PATH.split( '/' ) )
  }

  static getTempDir() {
    return path.join( FileUtils.getRootPath(), this.getTempFilePath() )
  }

  static toLocalPath( pathStr: string ): string {
    return pathStr.split( path.posix.sep ).join( path.sep )
  }

  static getFileFilename( filename: string ) {
    return path.join( this.getFilesDir(), filename )
  }
}
