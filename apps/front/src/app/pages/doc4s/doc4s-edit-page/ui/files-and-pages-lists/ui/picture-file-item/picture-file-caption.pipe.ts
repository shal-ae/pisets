import { Pipe, PipeTransform } from '@angular/core'
import { StrUtils } from 'libs/core/core-utils'
import { DocumentPage } from '../../../pages-editor/pages-editor.types'

@Pipe( {
  name: 'pictureFileCaption',
  standalone: true,
} )
export class PictureFileCaptionPipe implements PipeTransform {
  transform( value: DocumentPage ): string {
    if ( value.caption ) {
      return value.caption
    }
    const name = StrUtils.lastPartAfter( value.pageImage?.src || '', '/' )
    return `${name}`
  }
}
