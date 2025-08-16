import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { JOB_MAKE_PDF, PDF_QUEUE } from '../../job/job.const'
import { ComposePageService } from './compose-page.service'

@Processor( PDF_QUEUE )
export class ComposePageProcessor extends WorkerHost {
  constructor( private composePageService: ComposePageService ) {
    super()
  }

  async process( job: Job<any, any, string> ): Promise<any> {
    if ( job.name === JOB_MAKE_PDF ) {
      return this.composePageService.makePdfFromPictures( job.data, job )
    }
  }
}
