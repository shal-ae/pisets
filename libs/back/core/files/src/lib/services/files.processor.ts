import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { FILES_QUEUE, JOB_MAKE_SECONDARY_FILES } from './../types/job.const'
import { FilesService } from './files.service'

@Processor( FILES_QUEUE )
export class FilesProcessor extends WorkerHost {
  constructor( private filesService: FilesService ) {
    super()
  }

  async process( job: Job<any, any, string> ): Promise<any> {
    if ( job.name === JOB_MAKE_SECONDARY_FILES ) {
      return this.filesService.saveUploadedFile(
        job.data.file,
        job.data.options,
        job,
      )
    }
  }
}
