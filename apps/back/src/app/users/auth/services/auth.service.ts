import { Injectable } from '@nestjs/common'
import { authenticator } from 'otplib'
import { toDataURL } from 'qrcode'
import { User } from '../../entities/user.entity'
import { UserService } from '../../services/user.service'
import { UserLoginRequestDTO, UserLoginResponseDTO } from '../../types/users.types'
import { AUTH_HEADER_KEY, hashPassword, JWT_CONST, REFRESH_HEADER_KEY, SESSION_HEADER_KEY } from '../types/jwt.types'
import { SessionService } from './session.service'

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private userService: UserService,
  ) {
  }

  static getTokenFromHeaders( headers: Headers ): string {
    /** Bearer eyJhbGciOiJIUzI1NiI...*/
    return headers[ AUTH_HEADER_KEY ]?.substring( 7 ) || ''
  }

  static getSessionFromHeaders( headers: Headers ): string {
    /** Bearer eyJhbGciOiJIUzI1NiI...*/
    return headers[ SESSION_HEADER_KEY ] || ''
  }

  static getRefreshTokenFromHeaders( headers: Headers ): string {
    return headers[ REFRESH_HEADER_KEY ]
  }

  async validateUser( email: string, password: string ): Promise<boolean> {
    const user = await User.findOne( { where: { email }, raw: true } )
    if ( !user ) {
      return false
    }
    if ( user.isTwoFactorAuthenticationEnabled ) {
      if ( user.useOtpOnly ) {
        return this.isTwoFactorAuthenticationCodeValid( password, user )
      } else {
        return user.password === hashPassword( password )
      }
    } else {
      return user.password === hashPassword( password )
    }
  }

  async getCurrentUser( headers: Headers ): Promise<User | null> {
    return this.getUserByToken( AuthService.getTokenFromHeaders( headers ) )
  }

  async getUserByToken( token: string ): Promise<User | null> {
    return this.sessionService.getUserByToken( token )
  }

  async login( loginDTO: UserLoginRequestDTO ): Promise<UserLoginResponseDTO> {
    return this.sessionService.generateTokensAndStartSession(
      loginDTO.email,
      false,
    )
  }

  async loginWith2fa(
    userWithoutPsw: Partial<User>,
  ): Promise<UserLoginResponseDTO> {
    return this.sessionService.generateTokensAndStartSession(
      userWithoutPsw.email,
      true,
    )
  }

  async logout( currentToken: string ): Promise<boolean> {
    return this.sessionService.deleteSession( currentToken )
  }

  async generateTwoFactorAuthenticationSecret( user: User ) {
    const secret = authenticator.generateSecret()

    const otpAuthUrl = authenticator.keyuri(
      user.email,
      JWT_CONST.otpIssuer,
      secret,
    )

    await this.userService.setTwoFactorAuthenticationSecret( secret, user.id )

    return { secret, otpAuthUrl }
  }

  async generateQrCodeDataURL( otpAuthUrl: string ) {
    return toDataURL( otpAuthUrl )
  }

  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    return authenticator.verify( {
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    } )
  }
}
