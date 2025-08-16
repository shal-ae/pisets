import {
  Body,
  Controller,
  Headers,
  Ip,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiResultInterceptor, getRealIp } from 'libs/back/core/utils/src'
import { ActionResultDTO, ActionResultJobDTO } from 'libs/core/core-utils'
import { ListDTO, ListQueryParams } from 'libs/back/core/db/src'
import { TABLE_NAME_USER } from '../../database/database.const'
import { AdminGuard } from '../auth/guards/admin.guard'
import { Jwt2faAuthGuard } from '../auth/guards/jwt-2fa-auth.guard'
import { SessionService, UserSessionRedisData } from '../auth/services/session.service'
import { User } from '../entities/user.entity'
import { UserService } from '../services/user.service'
import { addCompanyToQueryParams } from '../types/company.types'
import { UserTokenType } from '../types/user-token.types'
import {
  InviteUserQueryDTO,
  RegisterQueryDTO,
  UserRemindPasswordQueryDTO,
  UserSetPasswordQueryDTO,
} from '../types/users.types'

@ApiTags( 'Пользователи' )
@UseInterceptors( new ApiResultInterceptor() )
@Controller( 'users' )
export class UsersController {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
  ) {
  }

  @UseGuards( Jwt2faAuthGuard )
  @Post( 'list' )
  async getUsers(
    @Headers() headers: any,
    @Body() request: ListQueryParams,
  ): Promise<ListDTO<User>> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers )
    addCompanyToQueryParams(
      request,
      sessionData.companyId,
      `"${TABLE_NAME_USER}"`,
    )
    return this.userService.getUsers( request )
  }

  @UseGuards( Jwt2faAuthGuard )
  @Post( 'upsert' )
  async addOrUpdateUser(
    @Headers() headers: any,
    @Body() body: Partial<User>,
  ): Promise<User> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    body.companyId = sessionData.companyId
    const user = await User.findByPk( sessionData.userId, { raw: true } )

    delete body.twoFactorAuthenticationSecret
    delete body.isTwoFactorAuthenticationEnabled

    if ( !user.access.isCompanyAdmin ) {
      if ( !body.id ) {
        throw new UnauthorizedException()
      }
      return this.userService.addOrUpdateUser( {
        id: body.id,
        companyId: body.companyId,
        password: body.password,
        settings: body.settings,
        useOtpOnly: body.useOtpOnly,
      } )
    } else {
      return this.userService.addOrUpdateUser( body )
    }
  }

  @UseGuards( AdminGuard )
  @UseGuards( Jwt2faAuthGuard )
  @Post( 'delete' )
  async deleteUsers(
    @Headers() headers: any,
    @Body() body: { ids: number[] },
  ): Promise<number> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    return this.userService.deleteUsers( body.ids, sessionData.companyId )
  }

  @Post( 'change-password' )
  async remind(
    @Request() req: Request,
    @Body() body: UserRemindPasswordQueryDTO,
    @Ip() ipAddress: string,
  ): Promise<ActionResultJobDTO> {
    return this.userService.remind( body, getRealIp( req, ipAddress ).ip )
  }

  @Post( 'set-password/:mode' )
  async setPassword(
    @Body() body: UserSetPasswordQueryDTO,
    @Param( 'mode' ) mode: UserTokenType,
  ): Promise<ActionResultDTO> {
    return this.userService.setPassword( body, mode )
  }

  @UseGuards( AdminGuard )
  @UseGuards( Jwt2faAuthGuard )
  @Post( 'invite' )
  async invite(
    @Headers() headers: any,
    @Request() req: Request,
    @Body() body: InviteUserQueryDTO,
    @Ip() ipAddress: string,
  ): Promise<ActionResultJobDTO> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    const user = await User.findByPk( sessionData.userId, { raw: true } )
    return this.userService.inviteOrRegister(
      user,
      body,
      getRealIp( req, ipAddress ).ip,
    )
  }

  @Post( 'register' )
  async register(
    @Body() body: RegisterQueryDTO,
    @Request() req: Request,
    @Ip() ipAddress: string,
  ): Promise<ActionResultDTO> {
    return this.userService.inviteOrRegister(
      null,
      body,
      getRealIp( req, ipAddress ).ip,
    )
  }
}
