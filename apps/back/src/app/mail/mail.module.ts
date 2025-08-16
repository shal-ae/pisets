import { MailerModule } from '@nestjs-modules/mailer'
import { forwardRef, Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { getMailConfig } from './mail.config'
import { MailProcessor } from './services/mail.processor'
import { MailService } from './services/mail.service'

@Module( {
  imports: [
    forwardRef( () => UsersModule ),
    MailerModule.forRootAsync( {
      useFactory: getMailConfig,
    } ),
  ],
  controllers: [],
  providers: [ MailService, MailProcessor ],
  exports: [ MailService ],
} )
export class MailModule {
}
