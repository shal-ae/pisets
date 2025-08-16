import { Module } from '@nestjs/common'
import { MailModule } from '../mail/mail.module'
import { UsersModule } from '../users/users.module'
import { Doc4sController } from './controllers/doc4s.controller'
import { ComposePageProcessor } from './services/compose-page.processor'
import { ComposePageService } from './services/compose-page.service'
import { Doc4sService } from './services/doc4s.service'

@Module( {
  controllers: [ Doc4sController ],
  imports: [
    UsersModule, MailModule,
  ],
  providers: [ Doc4sService, ComposePageService, ComposePageProcessor ],
} )
export class Doc4sModule {
}
