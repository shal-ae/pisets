import { User, UserAccess, UserSettings } from '../entities/user.entity'

export interface UserLoginRequestDTO {
  email: string;
  password: string;
}

export interface Turn2faRequestDTO {
  twoFactorAuthenticationCode: string;
  enable: boolean;
}

export interface UserLogin2faRequestDTO {
  email: string;
  twoFactorAuthenticationCode: string;
}

export interface UserLoginResponseDTO {
  user: Partial<User>;
  access_token: string;
  access_token_issued: number;
  access_token_expired: number;
  refresh_token: string;
  refresh_token_issued: number;
  refresh_token_expired: number;
}

export interface Generate2faResponseDTO {
  secret: string;
  otpAuthUrl: string;
  qrCodeDataUrl: string;
}

export interface UserRemindPasswordQueryDTO {
  email: string;
}

export interface UserSetPasswordQueryDTO {
  token: string;
  password: string;
}

export interface InviteUserQueryDTO {
  email: string;
  name: string;
  access: UserAccess;
  settings: UserSettings;
}

export interface RegisterQueryDTO {
  email: string;
  name: string;
  companyName: string;
}
