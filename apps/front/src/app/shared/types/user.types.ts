export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;

  createdAt?: Date;

  access: UserAccess | null

  settings: UserSettings | null

  isTwoFactorAuthenticationEnabled?: boolean;
  useOtpOnly?: boolean;
}

export type UserSettings = {
  notifications?: {
    emailOnNewDoc4s?: boolean;
    emailOnDocApproveResult?: boolean;
  };
};

export const DefaultUserItem: User = {
  id: 0,
  name: '',
  email: '',
  access: null,
  settings: null,
  isTwoFactorAuthenticationEnabled: false,
}

export type UserAccess = {
  isSystemAdmin?: boolean;
  isCompanyAdmin?: boolean;
  canSignDocuments?: boolean;
  canListAll?: boolean;
};

export interface UserChangePasswordQueryDTO {
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

export type UserTokenType = 'change-password' | 'invite-user' | 'register';
