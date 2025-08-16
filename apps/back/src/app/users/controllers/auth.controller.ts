import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiResultInterceptor } from 'libs/back/core/utils/src'
import { Jwt2faAuthGuard } from '../auth/guards/jwt-2fa-auth.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { LocalAuthGuard } from '../auth/guards/local-auth.guard'
import { AuthService } from '../auth/services/auth.service'
import { SessionService } from '../auth/services/session.service'
import { UserService } from '../services/user.service'

import {
  Generate2faResponseDTO,
  Turn2faRequestDTO,
  UserLogin2faRequestDTO,
  UserLoginRequestDTO,
  UserLoginResponseDTO,
} from '../types/users.types'

@UseInterceptors( new ApiResultInterceptor() )
@ApiTags( 'Аутентификация' )
@Controller( 'auth' )
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private userService: UserService,
  ) {
  }

  // @Public()
  @Post( 'login' )
  @UseGuards( LocalAuthGuard )
  async login(
    @Body() body: UserLoginRequestDTO,
  ): Promise<UserLoginResponseDTO> {
    return this.authService.login( body )
  }

  @Post( 'logout' )
  @UseGuards( Jwt2faAuthGuard )
  async logout( @Headers() headers: any ): Promise<boolean> {
    const token = AuthService.getTokenFromHeaders( headers )
    return this.authService.logout( token )
  }

  @Post( 'refresh' )
  @UseGuards( Jwt2faAuthGuard )
  async refreshToken( @Headers() headers: any ): Promise<UserLoginResponseDTO> {
    const token = AuthService.getTokenFromHeaders( headers )
    return this.sessionService.refreshSession( token )
  }

  @Post( '2fa/generate' )
  @UseGuards( JwtAuthGuard )
  async generate2FA( @Headers() headers: any ): Promise<Generate2faResponseDTO> {
    const token = AuthService.getTokenFromHeaders( headers )
    const user = await this.sessionService.getUserByToken( token )
    if ( !user ) {
      throw new UnauthorizedException( 'Wrong token code' )
    }
    const authSecret =
      await this.authService.generateTwoFactorAuthenticationSecret( user )
    const qrCodeDataUrl = await this.authService.generateQrCodeDataURL(
      authSecret.otpAuthUrl,
    )
    return { ...authSecret, qrCodeDataUrl }
  }

  @Post( '2fa/turn' )
  @UseGuards( JwtAuthGuard )
  async turnTwoFactorAuthentication(
    @Headers() headers: any,
    @Body() body: Turn2faRequestDTO,
  ): Promise<boolean> {
    const token = AuthService.getTokenFromHeaders( headers )
    const user = await this.sessionService.getUserByToken( token )
    if ( !user ) {
      throw new UnauthorizedException()
    }
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      user,
    )
    if ( !isCodeValid ) {
      return false
    }
    await this.userService.turnOnOffTwoFactorAuthentication(
      user.id,
      body.enable,
    )
    return true
  }

  @Post( '2fa/login' )
  @HttpCode( 200 )
  @UseGuards( JwtAuthGuard )
  async authenticate(
    @Body() body: UserLogin2faRequestDTO,
  ): Promise<UserLoginResponseDTO> {
    const user = await this.userService.findOne( body.email )
    if ( !user ) {
      throw new UnauthorizedException( 'Wrong token code' )
    }
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      user,
    )

    if ( !isCodeValid ) {
      throw new UnauthorizedException( 'Wrong authentication code' )
    }
    return this.authService.loginWith2fa( user )
  }
}
