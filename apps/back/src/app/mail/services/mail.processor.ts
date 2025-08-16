import { MailerService } from '@nestjs-modules/mailer'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { SentMessageInfo } from 'nodemailer'

import { JOB_SEND_EMAIL, MAILER_QUEUE } from '../../job/job.const'

@Processor( MAILER_QUEUE )
export class MailProcessor extends WorkerHost {
  constructor( private readonly mailerService: MailerService ) {
    super()
  }

  async process( job: Job<any, any, string> ): Promise<SentMessageInfo> {
    if ( job.name === JOB_SEND_EMAIL ) {
      return this.mailerService.sendMail( job.data )
    }
  }
}
