import * as fs from 'fs'
import { URL } from 'url'
import * as path from 'path'
import * as md5File from 'md5-file'
import got from 'got'
import { pipeline as streamPipeline } from 'node:stream/promises'
import { MyUtils } from '@app/back/utils/my-utils'

export interface DownloadResult {
  ok: boolean,
  src: string,
  dest: string,
  code?: number,
  message?: string,
  fileSizeInBytes?: number,
  md5?: string,
  foundLocally?: boolean,
}

export interface FileEntry {
  /**
   * Пример:  'file1.png'
   * */
  filename: string
}

export class FileUtils {

  static getRootPath(): string {
    return path.normalize( process.cwd() )
    // return path.normalize( path.join( require.main.filename, '../../..' ) )
  }

  static md5ofFile( filename: string ) {
    return md5File.sync( filename )
  }

  static createPathIfNotExist( path: string ): void {
    if ( !fs.existsSync( path ) ) fs.mkdirSync( path, {recursive: true} )
  }

  static createPathForFileIfNotExist( filename: string ): void {
    const dir = path.parse( filename ).dir
    this.createPathIfNotExist( dir )
  }

  private static getBasicAuthString ( username: string, password: string): string {
    if ( username || password ) {
      const u = username + ':' + password
      return 'Basic ' + Buffer.alloc( u.length, u ).toString( 'base64' )
    } else {
      return ''
    }
  }

  //private static getBasicAuthHeaders ( username: string, password: string): OutgoingHttpHeaders | undefined {
  //  if ( username || password ) {
  //    return {
  //      'Authorization': this.getBasicAuthString(username, password)
  //    }
  //  }
  //}

  static async downloadFileBasicAuth( fileLink: string, target: string, username = '', password = '', calculateMd5 = true, waitBeforeMs = 0 ): Promise<DownloadResult> {
    if (waitBeforeMs) {
      await MyUtils.timeout(waitBeforeMs)
    }
    const res: DownloadResult = {
      ok: false,
      src: fileLink,
      dest: target,
      code: 0, //400,
      fileSizeInBytes: 0,
    }

    console.log( 'downloading ' + fileLink )
    const link = encodeURI( decodeURI( fileLink ) )
    let urlObj: URL
    try {
      urlObj = new URL( link )
    } catch ( e ) {
      return res
    }

    if ( fileLink !== link ) {
      console.log( `fileLink = ${ fileLink }, encoded/decoded link = ${ link }` )
    }

    const time = new Date().getTime()
    const targetTmp = `${target}.${time}.tmp`

    this.createPathForFileIfNotExist( targetTmp )

    FileUtils.deleteFileIfExists(targetTmp)

    let headers = {}
    if (username || password) {
      headers = {
        "Authorization": this.getBasicAuthString(username, password)
      }
    }

    try {
      await streamPipeline(
          got.stream(link, { headers }),
          fs.createWriteStream(targetTmp)
      );

      FileUtils.deleteFileIfExists(target)
      await FileUtils.copyFile(targetTmp, target)
      FileUtils.deleteFileIfExists(targetTmp)

      const fileStat = FileUtils.getFileStat( target, calculateMd5 )

      res.ok = fileStat.ok
      res.code = 200
      res.fileSizeInBytes = fileStat.fileSizeInBytes
      if ( calculateMd5 ) {
        res.md5 = fileStat.md5
      }

    } catch (e) {
      res.message = e.message
      console.error(e)
      //console.error(e);
    }
    return res
  }

  //static async downloadFileBasicAuthOld( fileLink: string, target: string, username = '', password = '', calculateMd5 = true ): Promise<DownloadResult> {
  //  console.log( 'downloading ' + fileLink )
  //  const link = encodeURI( decodeURI( fileLink ) )
  //  let urlObj: URL
  //  try {
  //    urlObj = new URL( link )
  //  } catch ( e ) {
  //    return {
  //        ok: false,
  //        src: fileLink,
  //        dest: target,
  //        code: 400,
  //        fileSizeInBytes: 0,
  //      }
  //  }
  //
  //  if ( fileLink !== link ) {
  //    console.log( `fileLink = ${ fileLink }, encoded/decoded link = ${ link }` )
  //  }
  //
  //  const time = new Date().getTime()
  //  const targetTmp = `${target}.${time}.tmp`
  //
  //  this.createPathForFileIfNotExist( targetTmp )
  //
  //  FileUtils.deleteFileIfExists(targetTmp)
  //  console.log(`createWriteStream ${targetTmp}...`)
  //  const file = fs.createWriteStream( targetTmp )
  //  console.log(`stream created`)
  //
  //  const requestOptions: https.RequestOptions = {
  //    host: urlObj.hostname,
  //    path: urlObj.pathname + urlObj.search,
  //    headers: this.getBasicAuthHeaders(username, password)
  //  }
  //  //if ( username || password ) {
  //  //  const u = username + ':' + password
  //  //  requestOptions.headers = {
  //  //    'Authorization': 'Basic ' + Buffer.alloc( u.length, u ).toString( 'base64' ),
  //  //  }
  //  //}
  //
  //  return new Promise( resolve => {
  //
  //    const res: DownloadResult = {
  //      ok: false,
  //      src: fileLink,
  //      dest: target,
  //      code: 0,
  //      fileSizeInBytes: 0,
  //    }
  //    let module: any = https
  //    if ( urlObj.protocol === 'http:' ) {
  //      module = http
  //    }
  //    module.get( requestOptions, (response: http.IncomingMessage) => {
  //      if ( 200 !== response.statusCode ) {
  //        FileUtils.deleteFileIfExists(targetTmp)
  //        res.code = response.statusCode
  //        res.message = response.statusMessage
  //        resolve( res )
  //      } else {
  //        response.pipe( file )
  //        file.on( 'finish', () => {
  //          file.close()
  //
  //          FileUtils.deleteFileIfExists(target)
  //          FileUtils.copyFile(targetTmp, target)
  //          FileUtils.deleteFileIfExists(targetTmp)
  //
  //          const fileStat = FileUtils.getFileStat( target, calculateMd5 )
  //          res.ok = fileStat.ok
  //          res.fileSizeInBytes = fileStat.fileSizeInBytes
  //          if ( calculateMd5 ) {
  //            res.md5 = fileStat.md5
  //          }
  //          res.code = response.statusCode
  //          resolve( res )
  //        } )
  //        .on ( 'error', (err: Error) => {
  //              FileUtils.deleteFileIfExists(targetTmp)
  //              res.message = err.message
  //              resolve( res )
  //            })
  //      }
  //    } ).on( 'error', (err: Error) => {
  //      FileUtils.deleteFileIfExists(targetTmp)
  //      res.message = err.message
  //      resolve( res )
  //    } )
  //  } )
  //}

  static getFileStat( target: string, calculateMd5 = false ) {
    const res = {
      ok: false,
      fileSizeInBytes: 0,
      md5: '',
    }

    if ( fs.existsSync( target ) ) {
      const stats = fs.statSync( target )
      res.fileSizeInBytes = stats.size
      if ( calculateMd5 ) {
        res.md5 = this.md5ofFile( target )
      }
      res.ok = true
    }
    return res
  }

  static async readFileAsync( filename ): Promise<Buffer> {
    return new Promise( function ( resolve, reject ) {
      fs.readFile( filename, function ( err, data ) {
        if ( err )
          reject( err )
        else
          resolve( data )
      } )
    } )
  }

  static async writeFileAsync( filename: string, buffer: Buffer ): Promise<any> {
    return new Promise( function ( resolve, reject ) {
      fs.writeFile( filename, buffer, err => {
        if ( err )
          reject( err )
        else
          resolve( true )
      } )
    } )
  }

  /** copyFile -> sync. Не работало на windows. Файл не успевал копироваться, как его удаляли */
  static async copyFile( src: string, dest: string ): Promise<void> {
    return fs.copyFileSync( src, dest )
    // fs.copyFile( src, dest, ( err ) => {
    //   if ( err ) throw err
    //   // console.log( 'source.txt was copied to destination.txt' )
    // } )
  }

  // static copyFile(src: string, dest: string) {
  //   fs.copyFileSync(src, dest)
  //   // fs.copyFile( src, dest, ( err ) => {
  //   //   if ( err ) throw err
  //   //   // console.log( 'source.txt was copied to destination.txt' )
  //   // } )
  // }
  static deleteFileIfExists( filePath: string ): void {
    if (fs.existsSync( filePath )) {
      fs.unlinkSync (filePath)
    }
  }

  static async deleteFile( filePath: string ): Promise<void> {
    return fs.unlinkSync( filePath )
  }

  static fileExist( localPath: string ): boolean {
    return fs.existsSync( localPath )
  }

  static fileExt( filename: string ): string {
    const parts = filename.split( '.' )
    return parts[ parts.length - 1 ]
  }

  static fileWithoutExt( filename: string ): string {
    const parts = filename.split( '.' )
    parts.pop()
    return parts.join('.')
  }

  static isFileWithExtension( filename: string, extensions: string[] ): boolean {
    return extensions.includes( FileUtils.fileExt( filename.toLowerCase() ) )
  }

  static isPicture( filename: string ): boolean {
    return FileUtils.isFileWithExtension( filename, [ 'jpg', 'jpeg', 'png', 'gif' ] )
  }

  static isThumbnailSupportedPicture( filename: string ): boolean {
    return FileUtils.isFileWithExtension( filename, [ 'jpg', 'jpeg', 'png' ] )
  }

  static hashToFilepath( hash: string, originalFilename: string ): string {
    const filename = this.hashToFilename( hash, originalFilename )
    return path.join( ...this.hashToPartsForPath( filename ) )
  }

  static hashToFileFolder( hash: string ): string {
    const parts = [ hash.substring( 0, 2 ), hash.substring( 2, 4 )]
    return path.join( ...parts )
  }

  /** Изменяем хэш, чтобы по данным файла от поставщика нельзя было определить его ссылку на нашем сервере.
   * Возможно обратное преобразование. */
  static encodeMd5( md5: string ): string {
    const l = md5.length
    if ( l !== 32 ) {
      return md5
    }
    const dictionary = {
      '0': 'a', '1': 'd', '2': 'c', '3': 'f', '4': 'b', '5': '7', '6': '6', '7': '5',
      '8': '1', '9': '3', 'a': '2', 'b': '0', 'c': '4', 'd': '8', 'e': '9', 'f': 'e',
    }
    let res = ''
    for ( let i = 0; i < l; i++ ) {
      res += dictionary[ md5.substring( 31 - i, 32 - i ).toLowerCase() ]
    }
    return res
  }

  static listFiles( dir: string ): FileEntry[] {
    const res: string[] = []
    const list = fs.readdirSync( dir )

    for ( const f of list ) {
      const stats = fs.statSync( path.join( dir, f ) )
      if ( stats.isFile() ) {
        res.push( f )
      }
    }
    return res.map( e => ( {filename: e} ) )
  }

  private static hashToFilename( hash: string, originalFilename: string ): string {
    const ext = this.fileExt( originalFilename )
    if ( ext ) {
      return hash + '.' + ext
    }
    return hash
  }

  private static hashToPartsForPath( hash: string ): string[] {
    return [
      hash.substring( 0, 2 ),
      hash.substring( 2, 4 ),
      hash,
    ]
  }

}


