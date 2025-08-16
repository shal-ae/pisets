import { Pipe, PipeTransform } from '@angular/core'
import { JobItem } from 'libs/core/core-utils'

@Pipe( {
  name: 'jobPercent',
  standalone: true,
} )
export class JobPercentPipe implements PipeTransform {
  transform( job: JobItem ): number {
    if (
      job.status === 'active' &&
      job.progress &&
      typeof job.progress === 'number'
    ) {
      return job.progress
    }
    return 0
  }
}
