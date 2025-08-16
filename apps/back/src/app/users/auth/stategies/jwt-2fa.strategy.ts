import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../../services/user.service'
import { JWT_CONST } from '../types/jwt.types'

@Injectable()
export class Jwt2faStrategy extends PassportStrategy( Strategy, 'jwt-2fa' ) {
  constructor( private readonly userService: UserService ) {
    super( {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_CONST.secret,
      usernameField: 'email',
      passwordField: 'password',
    } )
  }

  async validate( payload: any ) {
    //    console.log('Jwt2faStrategy payload', payload)
    const user = await this.userService.findOne( payload.email )

    if ( !user.isTwoFactorAuthenticationEnabled ) {
      return user
    }
    if ( payload.isTwoFactorAuthenticated ) {
      return user
    }
  }
}
