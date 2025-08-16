import { sha1 } from '@rka/core-utils'
import * as process from 'process'

export const JWT_CONST = {
  secret: process.env.JWT_AUTH_SECRET,
  secretExpirationTime: 60 * +process.env.JWT_AUTH_EXPIRATION,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpirationTime: 60 * +process.env.JWT_REFRESH_EXPIRATION,
  hashPasswordSalt: process.env.JWT_HASH_PASSWORD_SALT,
  otpIssuer: process.env.JWT_OTP_ISSUER || 'pisets.ru',
}

export function accessTokenExpiration(): number {
  return Date.now() + 1000 * JWT_CONST.secretExpirationTime
}

export function refreshTokenExpiration(): number {
  return Date.now() + 1000 * JWT_CONST.refreshExpirationTime
}

export function hashPassword( password: string ): string {
  return sha1( password + JWT_CONST.hashPasswordSalt )
}

export const REFRESH_HEADER_KEY = 'refresh'
export const AUTH_HEADER_KEY = 'authorization'
export const SESSION_HEADER_KEY = 'session'
