import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../services/auth.service'
import { SessionService } from '../services/session.service'

@Injectable()
export class Jwt2faAuthGuard extends AuthGuard( 'jwt-2fa' ) {
  constructor( private sessionService: SessionService ) {
    super()
  }

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = AuthService.getTokenFromHeaders( request.headers )
    const sessionRedisData = await this.sessionService.getUserSessionData(
      token,
    )

    if ( sessionRedisData ) {
      request.sessionRedisData = sessionRedisData
    }
    // console.log(sessionRedisData)

    return !!sessionRedisData
    // if (sessionRedisData) {
    //   return super.canActivate(context)
    // }
  }
}
