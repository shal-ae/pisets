import { Pipe, PipeTransform } from '@angular/core'
import { JobItem, jobStatusToString } from 'libs/core/core-utils'

@Pipe( {
  name: 'jobTitle',
  standalone: true,
} )
export class JobTitlePipe implements PipeTransform {
  transform( job: JobItem ): string {
    let title = jobStatusToString( job.status )
    if ( job.title ) {
      title += `: ${job.title}`
    }
    return title
  }
}
