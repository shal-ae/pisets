import { Pipe, PipeTransform } from '@angular/core'
import { MyUtils } from '@rka/core-utils'

@Pipe( {
  name: 'dateToStr',
  standalone: true,
} )
export class DateToStrPipe implements PipeTransform {
  transform( value: Date, format = 'dd.MM.yy hh:mm' ): unknown {
    return MyUtils.formatDateTime( value, format )
  }
}
