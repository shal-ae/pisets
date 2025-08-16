import { User } from './user.types'

export const AUTH_LOCAL_STORAGE_KEY = 'auth'
export const AUTH_LOCAL_STORAGE_KEY_LAST_USER = 'auth_last_user'

export interface AuthStateModel {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  connecting: boolean;
  error: string;
  access_token_issued: Date | null;
  refresh_token_issued: Date | null;
}

export const AuthStateModelDefaults: AuthStateModel = {
  user: null,
  access_token: null,
  refresh_token: null,
  connecting: false,
  error: '',
  access_token_issued: null,
  refresh_token_issued: null,
}

export interface LoginResultDTO {
  user: User;
  access_token: string;
  access_token_issued: Date;
  access_token_expired: number;
  refresh_token: string;
  refresh_token_issued: Date;
  refresh_token_expired: number;
}

// request = {}, token used
export interface Generate2faResultDTO {
  secret: string; //   "MI5WSPJRKZUEMICP",
  otpAuthUrl: string; // "otpauth://totp/pisets.ru:al%40rk-a.ru?secret=MI5WSPJRKZUEMICP&period=30&digits=6&algorithm=SHA1&issuer=pisets.ru",
  qrCodeDataUrl: string; // "data:image/png;base64,iVBORw0KGg..........=="
}

export interface set2faRequestDTO {
  twoFactorAuthenticationCode: string;
  enable: boolean;
}

export type set2faResponseDTO = boolean; // true - ok, false - неверный код

export interface login2faRequestDTO {
  email: string;
  twoFactorAuthenticationCode: string;
}
