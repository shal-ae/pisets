import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import { User } from '../../entities/user.entity'
import { UserLoginResponseDTO } from '../../types/users.types'
import { accessTokenExpiration, JWT_CONST, refreshTokenExpiration } from '../types/jwt.types'
import { AuthService } from './auth.service'

export interface UserSessionRedisData {
  userId: number | null;
  companyId: number | null;
}

@Injectable()
export class SessionService {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {
  }

  async getUserSessionDataFromHeaders(
    headers: any,
    throwExceptionIfNoUser = false,
  ): Promise<UserSessionRedisData> {
    const res = await this.getUserSessionData(
      AuthService.getTokenFromHeaders( headers ),
    )
    if ( !res.userId && throwExceptionIfNoUser ) {
      throw new UnauthorizedException()
    }
    return res
  }

  async getUserSessionData( token: string ): Promise<UserSessionRedisData> {
    if ( !token ) {
      return { userId: null, companyId: null }
    }
    const sessionStr = await this.redis.get(
      SessionService.tokenToRedisKey( token ),
    )
    if ( !sessionStr ) {
      return { userId: null, companyId: null }
    }
    const sessionData: UserSessionRedisData = JSON.parse( sessionStr )
    if ( !sessionData?.userId ) {
      return { userId: null, companyId: null }
    }
    return sessionData
  }

  async getUserByToken( token: string ): Promise<User | null> {
    const sessionData = await this.getUserSessionData( token )
    if ( !sessionData ) {
      return null
    }
    return User.findByPk( sessionData.userId, { raw: true } )
  }

  async startSession( email: string, token: string ): Promise<User | null> {
    const user: User = await User.findOne( { where: { email }, raw: true } )
    if ( !user ) {
      return null
    }

    const sessionData: UserSessionRedisData = {
      userId: user.id,
      companyId: user.companyId,
    }

    await this.redis.set(
      SessionService.tokenToRedisKey( token ),
      JSON.stringify( sessionData ),
      'EX',
      JWT_CONST.secretExpirationTime,
    )

    return user
  }

  async refreshSession( token: string ): Promise<UserLoginResponseDTO> {
    const sessionStr = await this.redis.get(
      SessionService.tokenToRedisKey( token ),
    )
    if ( !sessionStr ) {
      throw new UnauthorizedException()
    }
    const sessionData: UserSessionRedisData = JSON.parse( sessionStr )
    const user = await User.findByPk( sessionData.userId )

    await this.deleteSession( token )

    return this.generateTokensAndStartSession(
      user.email,
      user.isTwoFactorAuthenticationEnabled,
    )
  }

  async deleteSession( token: string ): Promise<boolean> {
    await this.redis.del( SessionService.tokenToRedisKey( token ) )
    return true
  }

  async generateTokensAndStartSession(
    email: string,
    is2fa: boolean,
  ): Promise<UserLoginResponseDTO> {
    const payload = SessionService.getAuthPayload( email, is2fa )

    const access_token = this.generateAccessToken( payload )
    const refresh_token = this.generateRefreshToken( payload )
    const { password, twoFactorAuthenticationSecret, ...user } =
      await this.startSession( payload.email, access_token )

    return {
      user,
      access_token,
      access_token_issued: Date.now(),
      access_token_expired: accessTokenExpiration(),
      refresh_token,
      refresh_token_issued: Date.now(),
      refresh_token_expired: refreshTokenExpiration(),
    }
  }

  private static getAuthPayload( email: string, is2fa = false ): any {
    return is2fa
      ? {
        email,
        isTwoFactorAuthenticationEnabled: true,
        isTwoFactorAuthenticated: true,
      }
      : { email }
  }

  private static tokenToRedisKey( token: string ): string {
    return `session:${token}`
  }

  private generateAccessToken( payload: object ): string {
    return this.jwtService.sign( payload, {
      secret: JWT_CONST.secret,
      expiresIn: JWT_CONST.secretExpirationTime,
    } )
  }

  private generateRefreshToken( payload: object ): string {
    return this.jwtService.sign( payload, {
      secret: JWT_CONST.refreshTokenSecret,
      expiresIn: JWT_CONST.refreshExpirationTime,
    } )
  }
}
