import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { ApiResult, FileUploadOptions, FileUploadResult } from '@rka/core-utils'
import { map, Observable } from 'rxjs'

@Injectable()
export class FileUploadService {
  http = inject( HttpClient )

  upload( uploadUrl: string, file: File, options: FileUploadOptions ): Observable<FileUploadResult | undefined> {
    const formData = new FormData()
    formData.append( 'file', file )
    formData.append( 'options', JSON.stringify( options ) )
    return this.http
      .post<ApiResult<FileUploadResult>>( uploadUrl, formData )
      .pipe(
        map( ( res: ApiResult<FileUploadResult> | undefined ) => res?.payload ),
      )
  }
}
