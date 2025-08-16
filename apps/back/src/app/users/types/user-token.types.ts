import { InviteUserQueryDTO, RegisterQueryDTO } from './users.types'

export type UserTokenType = 'change-password' | 'invite-user' | 'register';

export interface UserToken {
  type: UserTokenType;
  userId: number;
  companyId: number;
}

export interface UserTokenChangePassword extends UserToken {
}

export interface UserTokenInviteUser extends UserToken {
  query: InviteUserQueryDTO;
}

export interface UserTokenRegister {
  type: UserTokenType;
  query: RegisterQueryDTO;
}
