import { CatCatalog } from '@app/back/cat/entities/catalog.entity'

import { FileUtils } from '@app/back/utils/file.utils'
import * as crypto from 'crypto'
import * as path from 'path'
import { ERP_FILES_PATH, PRIVATE_FILES_PATH, PUBLIC_FILES_PATH, TEMP_FILES_PATH } from '../types/config'
import { CATALOG_FILES_FILENAME, CATALOG_FILES_SRC_LOCAL_FILENAME } from '../types/loaders.types'

export class FileLocation {
  static getPublicFilePath(): string {
    return path.join( ...PUBLIC_FILES_PATH.split( '/' ) )
  }

  static getPublicDir(): string {
    return path.join( FileUtils.getRootPath(), FileLocation.getPublicFilePath() )
  }

  static getPublicDirFiles(): string {
    return path.join( FileLocation.getPublicDir(), 'files' )
  }

  static getCatalogsDir(): string {
    return path.join( FileLocation.getPublicDir(), 'files', 'catalog' )
  }

  static getCatalogDir( catalogId: number ): string {
    return path.join( FileLocation.getCatalogsDir(), catalogId.toString() )
  }

  static getCatalogFilesDir( catalogId: number ): string {
    return path.join( FileLocation.getCatalogDir( catalogId ), 'f' )
  }

  static getCatalogFilename( catalogId: number, filename: string ): string {
    return path.join( this.getCatalogFilesDir( catalogId ), this.toLocalPath( filename ) )
  }

  static getCatalogThumbnailDir( catalogId: number ): string {
    return path.join( FileLocation.getCatalogDir( catalogId ), 'th' )
  }

  static getCatalogXmlDir( catalogId: number ): string {
    return path.join( FileLocation.getCatalogDir( catalogId ), 'xml' )
  }

  static getCatalogThumbnailFilename( catalogId: number, groupName: string, filename: string ): string {
    return path.join( this.getCatalogThumbnailDir( catalogId ), groupName, this.toLocalPath( filename ) )
  }

  static getTempFilePath(): string {
    return path.join( ...TEMP_FILES_PATH.split( '/' ) )
  }

  static getTempDir() {
    return path.join( FileUtils.getRootPath(), FileLocation.getTempFilePath() )
  }

  static getImportFilesTempDir( catalog: CatCatalog ) {
    return path.join( FileLocation.getTempDir(), catalog.code )
  }

  static getCommonCatalogTempDir() {
    return path.join( FileLocation.getTempDir(), 'common' )
  }

  static getCommonCatalogTempFilePath( filename: string ): string {
    return path.join( FileLocation.getCommonCatalogTempDir(), filename )
  }

// Не используется, копируем в приватный каталог
//   static getCommonCatalogDir(): string {
//     return path.join( FileLocation.getCatalogsDir(), 'common' )
//   }
//
//   static getCommonCatalogExportDir(): string {
//     return path.join( FileLocation.getCommonCatalogDir(), 'export' )
//   }
//
//   static getCommonCatalogExportFilePath( filename: string ): string {
//     return path.join( FileLocation.getCommonCatalogExportDir(), filename )
//   }


  static getUploadFilesTempDir() {
    return path.join( FileLocation.getTempDir(), 'upload' )
  }

  static getUploadFilesTempFilename( prefix = '', suffix = '' ): string {
    return path.join( this.getUploadFilesTempDir(), prefix + crypto.randomBytes( 4 ).readUInt32LE( 0 ) + suffix )
  }

  static getCloudCatalogFilesLocalFilename( catalogId: number ): string {
    return path.join( FileLocation.getCatalogXmlDir( catalogId ), CATALOG_FILES_FILENAME )
  }

  static getCloudCatalogFilesWithSourceAndLocalFilenames( catalogId: number ): string {
    return path.join( FileLocation.getCatalogXmlDir( catalogId ), CATALOG_FILES_SRC_LOCAL_FILENAME )
  }

  static toLocalPath( pathStr: string ): string {
    return pathStr.split( path.posix.sep ).join( path.sep )
  }

  static toUrlPath( pathStr: string ): string {
    return pathStr.split( path.sep ).join( path.posix.sep )
  }

  static getErpFilePath(): string {
    return path.join( ...ERP_FILES_PATH.split( '/' ) )
  }

  static getErpDir(): string {
    return path.join( FileUtils.getRootPath(), FileLocation.getErpFilePath() )
  }

  static getErpPublicDir(): string {
    return path.join( FileLocation.getErpDir(), 'public' )
  }

  static getErpPublicPicturesDir(): string {
    return path.join( FileLocation.getErpPublicDir(), 'pictures' )
  }

  static getErpPublicPicturesFilesDir(): string {
    return path.join( FileLocation.getErpPublicPicturesDir(), 'f' )
  }

  static getErpPublicPicturesThumbnailDir(): string {
    return path.join( FileLocation.getErpPublicPicturesDir(), 'th' )
  }

  static getErpPublicPicturesFileFilename( filename: string ): string {
    return path.join( this.getErpPublicPicturesFilesDir(), this.toLocalPath( filename ) )
  }

  static getErpPublicPicturesThumbnailFilename( groupName: string, filename: string ): string {
    return path.join( this.getErpPublicPicturesThumbnailDir(), groupName, this.toLocalPath( filename ) )
  }

  static getErpFileFilename( filename: string ): string {
    return path.join( this.getErpDir(), filename )
  }

  static getPrivateFilePath(): string {
    return path.join( ...PRIVATE_FILES_PATH.split( '/' ) )
  }

  static getPrivateCatalogsFilePath(): string {
    return path.join( FileLocation.getPrivateFilePath(), 'catalog' )
  }

  static getPrivateCatalogFilename( filename: string ): string {
    return path.join( this.getPrivateCatalogsFilePath(), filename )
  }
}
