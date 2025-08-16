import { Pipe, PipeTransform } from '@angular/core'
import { StrUtils } from 'libs/core/core-utils'
import { UploadedFile } from '../../../../../../../shared/types/doc4s.types'

@Pipe( {
  name: 'uploadedFileCaption',
  standalone: true,
} )
export class UploadedFileCaptionPipe implements PipeTransform {
  transform( value: UploadedFile ): string {
    const name = StrUtils.lastPartAfter( value.originalName || '', '/' )
    return `${name}`
  }
}
