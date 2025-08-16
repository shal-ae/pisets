import { Body, Controller, Delete, Headers, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiResultInterceptor } from 'libs/back/core/utils/src'
import { ListDTO, ListQueryParams } from 'libs/back/core/db/src'

import { TABLE_NAME_STAMP } from '../../database/database.const'
import { AdminGuard } from '../../users/auth/guards/admin.guard'
import { SessionService, UserSessionRedisData } from '../../users/auth/services/session.service'
import { addCompanyToQueryParams } from '../../users/types/company.types'
import { StampService } from '../services/stamp.service'
import { StampData } from '../types/stamp.types'

@ApiTags( 'Штампы' )
@UseInterceptors( new ApiResultInterceptor() )
@Controller( 'edit/stamp' )
export class StampController {
  constructor(
    private readonly stampService: StampService,
    private readonly sessionService: SessionService,
  ) {
  }

  @Post( 'list' )
  async getStamps(
    @Headers() headers: any,
    @Body() request?: ListQueryParams,
  ): Promise<ListDTO<StampData>> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers )
    addCompanyToQueryParams(
      request,
      sessionData.companyId,
      `"${TABLE_NAME_STAMP}"`,
    )
    return this.stampService.list( request )
  }

  @UseGuards( AdminGuard )
  @Post( 'upsert' )
  async addOrUpdate(
    @Headers() headers: any,
    @Body() body: Partial<StampData>,
  ): Promise<StampData> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    return this.stampService.upsert( body, sessionData.companyId )
  }

  @UseGuards( AdminGuard )
  @Delete( ':ids' )
  async deleteStamp(
    @Headers() headers: any,
    @Param( 'ids' ) ids: string,
  ): Promise<number> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    return this.stampService.delete(
      ids.split( ',' ).map( ( e ) => +e ),
      sessionData.companyId,
    )
  }

  @UseGuards( AdminGuard )
  @Post( 'delete' )
  async delete(
    @Headers() headers: any,
    @Body() body: { ids: number[] },
  ): Promise<number> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    return this.stampService.delete( body.ids, sessionData.companyId )
  }
}
