import { Inject, Injectable, Logger } from '@nestjs/common'
import { FileUtils } from '@rka/back-utils'
import { S3 } from 'aws-sdk'
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload'
import { S3_MODULE_CONFIG_TOKEN, S3ModuleConfig } from '../types/s3-module.types'
import { S3ConnectionConfig } from '../types/s3.types'

@Injectable()
export class S3Service {
  private connections: Map<string, S3> = new Map<string, S3>

  constructor( @Inject( S3_MODULE_CONFIG_TOKEN ) private config: S3ModuleConfig ) {
  }

  async upload( localFilePath: string, key: string, connection = '' ): Promise<ManagedUpload.SendData> {
    const s3 = this.getS3( connection )

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.getConfig( connection ).bucket,
      Key: key,
      Body: await FileUtils.readFileAsync( localFilePath ),
      // ACL: 'public-read',
    }
    return new Promise( ( resolve, reject ) => {
      s3.upload( params, ( err: Error, data: ManagedUpload.SendData ) => {
        if ( err ) {
          Logger.error( err )
          reject( err.message )
        }
        resolve( data )
      } )
    } )
  }

  async download( key: string, connection = '' ): Promise<S3.GetObjectOutput> {
    const s3 = this.getS3( connection )
    const params = {
      Bucket: this.getConfig( connection ).bucket,
      Key: key,
    }

    return new Promise( ( resolve, reject ) => {
      s3.getObject( params, ( err, data: S3.GetObjectOutput ) => {
        if ( err ) {
          reject( err )
        } else {
          resolve( data )
        }
      } )
    } )
  }

  async list( prefix: string, connection = '' ): Promise<S3.ListObjectsV2Output> {
    const s3 = this.getS3( connection )
    const params = {
      Bucket: this.getConfig( connection ).bucket,
      Prefix: prefix,
    }

    return new Promise( ( resolve, reject ) => {
      s3.listObjectsV2( params, ( err, data: S3.ListObjectsV2Output ) => {
        if ( err ) {
          reject( err )
        } else {
          resolve( data )
        }
      } )
    } )
  }

  private getS3( connection: string ): S3 {
    if ( !this.config.connections.length ) {
      throw new Error( 'No S3 connections configured' )
    }
    let config
    if ( connection === '' ) {
      config = this.config.connections[ 0 ]
    } else {
      config = this.config.connections.find( ( c ) => c.name === connection )
    }
    if ( !config ) {
      throw new Error( `No S3 connection found for "${connection}"` )
    }

    let s3Connection = this.connections.get( connection )
    if ( !s3Connection ) {
      s3Connection = new S3( {
        region: config.region,
        endpoint: config.endpoint,
        credentials: {
          accessKeyId: config.accessKey,
          secretAccessKey: config.secretKey,
        },
      } )
      this.connections.set( connection, s3Connection )
    }
    return s3Connection
  }

  private getConfig( connection: string ): S3ConnectionConfig {
    const res = this.config.connections.find( ( c ) => c.name === connection )
    if ( !res ) {
      throw new Error( `S3 connection "${connection}" not found` )
    }
    return res
  }

  async signUrl( key: string, expires: number, connection = '' ): Promise<string> {
    const params = {
      Bucket: this.getConfig( connection ).bucket,
      Key: key,
      Expires: expires,
    }

    return await new Promise( ( resolve, reject ) => {
      this.getS3( connection ).getSignedUrl( 'getObject', params, ( err, url ) => {
        if ( err ) {
          reject( err )
        } else {
          resolve( url )
        }
      } )
    } )
  }

  // async signUrls( signUrlRequest: SignUrlRequest, user: User | null ): Promise<SignUrlResponse> {
  //   const urls: SignUrl[] = [];
  //   for (const url of signUrlRequest.paths) {
  //     const canAccess = await this.s3Auth.canAccessUrl(url, user);
  //
  //     if (canAccess) {
  //       const s3Info: UrlS3Info | null = this.s3Auth.urlToS3(url);
  //       if (s3Info === null) {
  //         urls.push({
  //           path: url,
  //           signedUrl: null,
  //           ttl: null,
  //           error: 'Not found in S3',
  //         });
  //       } else {
  //         const signedUrl = await this.signUrl(
  //           s3Info.bucket,
  //           s3Info.key,
  //           s3Info.ttl ?? 0
  //         );
  //         urls.push({
  //           path: url,
  //           signedUrl,
  //           ttl: s3Info.ttl,
  //         });
  //       }
  //     } else {
  //       urls.push({
  //         path: url,
  //         signedUrl: null,
  //         ttl: null,
  //         error: 'Access denied',
  //       });
  //     }
  //   }
  //
  //   return { urls };
  // }

}
