import { HttpClient } from '@angular/common/http'
import { computed, inject } from '@angular/core'
import { patchState, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals'
import { AddJobResponseItem, ApiResult, FileUploadOptions, FileUploadResult } from '@rka/core-utils'
import { map, Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

export type UploadStatus =
  | 'idle'
  | 'uploading'
  | 'uploaded'
  | { error: string };
export type UploadStatusState = { uploadStatus: UploadStatus };

export function withUploadFile() {
  return signalStoreFeature(
    withState<UploadStatusState>( { uploadStatus: 'idle' } ),
    withComputed( ( { uploadStatus } ) => ({
      uploading: computed( () => uploadStatus() === 'uploading' ),
      uploaded: computed( () => uploadStatus() === 'uploaded' ),
      error: computed( () => {
        const status = uploadStatus()
        return typeof status === 'object' ? status.error : null
      } ),
    }) ),
    withMethods( ( store, http = inject( HttpClient ) ) => ({
      upload(
        url: string,
        file: File,
        options: FileUploadOptions,
      ): Observable<FileUploadResult | undefined> {
        const formData = new FormData()
        formData.append( 'file', file )
        formData.append( 'options', JSON.stringify( options ) )
        patchState( store, setUploading() )
        return http
          .post<ApiResult<FileUploadResult>>( url, formData )
          .pipe(
            catchError( ( err ) => {
              patchState( store, setUploadError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map( ( res: ApiResult<FileUploadResult> | undefined ) => {
              if ( res?.payload ) {
                // console.log(res.payload)
                patchState( store, setUpLoaded() )
                return res.payload
              } else {
                return undefined
              }
            } ),
          )
      },

      uploadToJob(
        url: string,
        file: File,
        options: FileUploadOptions,
      ): Observable<AddJobResponseItem | undefined> {
        const formData = new FormData()
        formData.append( 'file', file )
        formData.append( 'options', JSON.stringify( options ) )
        patchState( store, setUploading() )
        return http
          .post<ApiResult<AddJobResponseItem>>(
            url,
            formData,
          )
          .pipe(
            catchError( ( err ) => {
              patchState( store, setUploadError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map( ( res: ApiResult<AddJobResponseItem> | undefined ) => {
              if ( res?.payload ) {
                patchState( store, setUpLoaded() )
                return res.payload
              } else {
                return undefined
              }
            } ),
          )
      },
    }) ),
  )
}

export function setUploading(): UploadStatusState {
  return { uploadStatus: 'uploading' }
}

export function setUploadingIdle(): UploadStatusState {
  return { uploadStatus: 'idle' }
}

export function setUpLoaded(): UploadStatusState {
  return { uploadStatus: 'uploaded' }
}

export function setUploadError( error: string ): UploadStatusState {
  return { uploadStatus: { error } }
}
