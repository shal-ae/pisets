import { Injectable } from '@nestjs/common'
import { ActionResultDTO, ActionResultJobDTO, AddJobResponseItem, makeRandomId, ValidateUtils } from '@rka/core-utils'
import { ListDTO, ListQueryParams, ListService, ListServiceQueryParams } from '@rka/db'
import { ConfirmService } from '@rka/job-back'
import { DEFAULT_EMAIL, DEFAULT_PASSWORD } from '../../config'
import { MailService } from '../../mail/services/mail.service'
import { hashPassword } from '../auth/types/jwt.types'
import { Company } from '../entities/company.entity'
import { User, UserFullAccess } from '../entities/user.entity'
import {
  ERROR_TOKEN_NOT_FOUND,
  ERROR_USER_ALREADY_REGISTERED,
  ERROR_USER_INVALID_EMAIL,
  ERROR_USER_INVALID_PASSWORD,
  ERROR_USER_NOT_REGISTERED,
} from '../types/user-errors.const'
import {
  UserToken,
  UserTokenChangePassword,
  UserTokenInviteUser,
  UserTokenRegister,
  UserTokenType,
} from '../types/user-token.types'
import {
  InviteUserQueryDTO,
  RegisterQueryDTO,
  UserRemindPasswordQueryDTO,
  UserSetPasswordQueryDTO,
} from '../types/users.types'


@Injectable()
export class UserService {
  constructor(
    private readonly listService: ListService,
    private readonly mailService: MailService,
    private readonly confirmService: ConfirmService,
  ) {
  }

  async findOne( email: string ): Promise<User | undefined> {
    return User.findOne( { where: { email }, raw: true } )
  }

  async setTwoFactorAuthenticationSecret(
    twoFactorAuthenticationSecret: string,
    userId: number,
  ) {
    await this.addOrUpdateUser( { id: userId, twoFactorAuthenticationSecret } )
  }

  async turnOnOffTwoFactorAuthentication( userId: number, enabled: boolean ) {
    await this.addOrUpdateUser( {
      id: userId,
      isTwoFactorAuthenticationEnabled: !!enabled,
    } )
  }

  async getUsers( request: ListQueryParams ): Promise<ListDTO<User>> {
    const listServiceQueryParams: ListServiceQueryParams = {
      ...request,
      tableName: `"user"`,
      columns: '*',
    }
    const d = await this.listService.list<User>( listServiceQueryParams )
    for ( const user of d.data ) {
      this.normalizeUser( user )
    }
    return d
  }

  private normalizeUser( user: User ): void {
    user.password = null
    user.twoFactorAuthenticationSecret = null
  }

  async addOrUpdateUser( body: Partial<User> ): Promise<User | null> {
    if ( body.id === 0 ) {
      body.id = null
    }
    let user: User
    if ( body.id ) {
      [ user ] = await User.findOrBuild( { where: { id: body.id } } )
    } else {
      [ user ] = await User.findOrBuild( { where: { email: body.email } } )
    }
    const psw = user.password

    user.set( body )

    if ( body.password ) {
      user.password = hashPassword( body.password )
    } else {
      user.password = psw
    }
    return (await user.save()).get()
  }

  async addAdmin(
    email = DEFAULT_EMAIL,
    password = DEFAULT_PASSWORD,
  ): Promise<User | null> {
    const body: Partial<User> = {
      email,
      name: 'Admin',
      access: UserFullAccess,
      password,
      companyId: null,
    }
    const user = await User.findOne( { where: { email } } )
    if ( user ) {
      body.id = user.id
    }
    return this.addOrUpdateUser( body )
  }

  async deleteUsers( ids: number[], companyId: number | null ): Promise<number> {
    const idsToDelete: number[] = []
    for ( const id of ids ) {
      const user = await User.findOne( { where: { companyId, id } } )
      if ( user ) {
        idsToDelete.push( id )
      }
    }
    if ( idsToDelete.length ) {
      return User.destroy( { where: { id: idsToDelete } } )
    } else {
      return 0
    }
  }

  async remind(
    body: UserRemindPasswordQueryDTO,
    ipAddress: string,
  ): Promise<ActionResultJobDTO> {
    const validateEmailResult = ValidateUtils.validateEmail( body.email )
    if ( validateEmailResult !== null ) {
      return {
        ok: false,
        error: {
          code: ERROR_USER_INVALID_EMAIL,
          message: validateEmailResult,
        },
        job: null,
      }
    }
    const user = await User.findOne( { where: { email: body.email } } )
    if ( !user ) {
      return {
        ok: false,
        error: {
          code: ERROR_USER_NOT_REGISTERED,
          message: 'Пользователь с таким email не зарегистрирован',
        },
        job: null,
      }
    }

    const data: UserTokenChangePassword = {
      type: 'change-password',
      userId: user.id,
      companyId: user.companyId,
    }
    const token = await this.confirmService.makeToken( data, 60 * 60 * 24 )

    const job = await this.mailService.sendChangePassword(
      user.id,
      token,
      ipAddress,
    )
    return {
      ok: true,
      job,
      error: null,
    }
  }

  async setPassword(
    body: UserSetPasswordQueryDTO,
    tokenType: UserTokenType,
  ): Promise<ActionResultDTO> {
    const validatePassword = ValidateUtils.validatePassword( body.password )
    if ( validatePassword !== null ) {
      return {
        ok: false,
        error: {
          code: ERROR_USER_INVALID_PASSWORD,
          message: validatePassword,
        },
      }
    }

    const d = await this.confirmService.checkToken( body.token, true )
    if ( d === null ) {
      return {
        ok: false,
        error: {
          code: ERROR_TOKEN_NOT_FOUND,
          message: 'Ссылка неверная, либо просрочена',
        },
      }
    }

    if ( tokenType === 'invite-user' ) {
      const data: UserTokenInviteUser = d

      await this.addOrUpdateUser( {
        id: null,
        companyId: data.companyId,
        password: body.password,
        email: data.query.email,
        name: data.query.name,
        access: data.query.access,
        settings: data.query.settings,
        twoFactorAuthenticationSecret: null,
        isTwoFactorAuthenticationEnabled: false,
      } )
    }

    if ( tokenType === 'change-password' ) {
      const data: UserToken = d
      const user = await User.findOne( { where: { id: data.userId } } )
      if ( !user ) {
        return {
          ok: false,
          error: {
            code: ERROR_USER_NOT_REGISTERED,
            message: 'Пользователь не найден',
          },
        }
      }

      await this.addOrUpdateUser( {
        id: user.id,
        password: body.password,
        isTwoFactorAuthenticationEnabled: false,
      } )
    }

    if ( tokenType === 'register' ) {
      const data: UserTokenRegister = d
      const company = await Company.create( {
        name: data.query.companyName,
        code: makeRandomId( 8 ).toUpperCase(),
      } )

      await this.addOrUpdateUser( {
        id: null,
        email: data.query.email,
        companyId: company.id,
        name: data.query.name,
        password: body.password,
        twoFactorAuthenticationSecret: null,
        isTwoFactorAuthenticationEnabled: false,
        access: {
          isCompanyAdmin: true,
          isSystemAdmin: false,
          canSignDocuments: true,
        },
        settings: {
          notifications: {
            emailOnNewDoc4s: true,
          },
        },
      } )
    }

    return {
      ok: true,
      error: null,
    }
  }

  async inviteOrRegister(
    user: User | null,
    body: InviteUserQueryDTO | RegisterQueryDTO,
    ipAddress: string,
  ) {
    const validateEmailResult = ValidateUtils.validateEmail( body.email )
    if ( validateEmailResult !== null ) {
      return {
        ok: false,
        error: {
          code: ERROR_USER_INVALID_EMAIL,
          message: validateEmailResult,
        },
        job: null,
      }
    }
    const u = await User.findOne( { where: { email: body.email } } )
    if ( u ) {
      return {
        ok: false,
        error: {
          code: ERROR_USER_ALREADY_REGISTERED,
          message: 'Пользователь с таким email уже зарегистрирован',
        },
        job: null,
      }
    }

    let job: AddJobResponseItem | null = null

    if ( user ) {
      const data: UserTokenInviteUser = {
        companyId: user.companyId,
        type: 'invite-user',
        userId: user.id,
        query: body as InviteUserQueryDTO,
      }
      const token = await this.confirmService.makeToken( data, 60 * 60 * 24 * 2 )
      job = await this.mailService.sendInvitation(
        user.id,
        token,
        ipAddress,
        data.query,
      )
    } else {
      const data: UserTokenRegister = {
        type: 'register',
        query: body as RegisterQueryDTO,
      }
      const token = await this.confirmService.makeToken( data, 60 * 60 * 24 )
      job = await this.mailService.sendConfirmRegister(
        token,
        ipAddress,
        data.query,
      )
    }

    return {
      ok: true,
      job,
      error: null,
    }
  }

  async register(
    body: RegisterQueryDTO,
    ipAddress: string,
  ): Promise<ActionResultDTO> {
    return undefined
  }
}
