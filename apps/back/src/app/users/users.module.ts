import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { MailModule } from '../mail/mail.module'
import { AdminGuard } from './auth/guards/admin.guard'
import JwtRefreshGuard from './auth/guards/jwt-refresh.guard'
import { LocalAuthGuard } from './auth/guards/local-auth.guard'
import { AuthService } from './auth/services/auth.service'
import { SessionService } from './auth/services/session.service'
import { Jwt2faStrategy } from './auth/stategies/jwt-2fa.strategy'
import { JwtRefreshTokenStrategy } from './auth/stategies/jwt-refresh-token.strategy'
import { JwtStrategy } from './auth/stategies/jwt.strategy'
import { LocalStrategy } from './auth/stategies/local.strategy'
import { AuthController } from './controllers/auth.controller'
import { UsersController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module( {
  imports: [
    PassportModule,
    JwtModule.register( {} ),
    forwardRef( () => MailModule ),
  ],
  controllers: [ AuthController, UsersController ],
  providers: [
    UserService,
    AuthService,
    SessionService,
    LocalStrategy,
    Jwt2faStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtRefreshGuard,
    LocalAuthGuard,
    // {
    //   provide: APP_GUARD,
    //   useClass: Jwt2faAuthGuard,
    // },
    AdminGuard,
  ],
  exports: [ UserService, AuthService, SessionService, AdminGuard ],
} )
export class UsersModule {
}
