import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { StampController } from './controllers/stamp.controller'
import { StampService } from './services/stamp.service'

@Module( {
  imports: [
    UsersModule,
  ],
  controllers: [ StampController ],
  providers: [ StampService ],
} )
export class StampModule {
}
