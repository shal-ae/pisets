import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JWT_CONST } from '../types/jwt.types'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor() {
    super( {
      jwtFromRequest: ExtractJwt.fromHeader( 'refresh' ),
      ignoreExpiration: false,
      secretOrKey: JWT_CONST.refreshTokenSecret,
    } )
  }

  async validate( payload: any ) {
    return payload
  }
}
