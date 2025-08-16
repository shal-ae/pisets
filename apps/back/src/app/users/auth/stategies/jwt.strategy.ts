import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JWT_CONST } from '../types/jwt.types'

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor() {
    super( {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONST.secret,
      usernameField: 'email',
      passwordField: 'password',
    } )
  }

  async validate( payload: any ) {
    return payload
  }
}
