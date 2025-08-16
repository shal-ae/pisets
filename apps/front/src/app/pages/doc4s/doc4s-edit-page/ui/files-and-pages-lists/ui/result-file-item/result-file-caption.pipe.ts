import { Pipe, PipeTransform } from '@angular/core'
import { MyUtils, StrUtils } from 'libs/core/core-utils'
import { ResultFile } from '../../../../../../../shared/types/doc4s.types'

@Pipe( {
  name: 'resultFileCaption',
  standalone: true,
} )
export class ResultFileCaptionPipe implements PipeTransform {
  transform( value: ResultFile ): string {
    const fn = StrUtils.lastPartAfter( value.filePath, '/' )
    const dt = MyUtils.formatDateTime( value.generatedAt, 'dd.MM.yy hh:mm' )
    return `${dt} - ${fn}`
  }
}
