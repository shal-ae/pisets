import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { sleepPromise } from 'libs/back/core/utils/src'
import { Strategy } from 'passport-local'
import { AuthService } from '../services/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy( Strategy ) {
  constructor( private authService: AuthService ) {
    super( {
      usernameField: 'email',
      passwordField: 'password',
    } )
  }

  async validate( email: string, password: string ): Promise<boolean> {
    await sleepPromise( 500 )
    const res = await this.authService.validateUser( email, password )
    if ( !res ) {
      throw new UnauthorizedException()
    }
    return res
  }
}
