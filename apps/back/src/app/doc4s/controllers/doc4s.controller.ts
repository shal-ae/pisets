import { Body, Controller, Headers, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultInterceptor } from '@rka/back-utils'
import {
  AddJobResponseItem,
  ComposeDocumentPageRequest,
  ComposeDocumentPageResponse,
  MakePdfFromPicturesRequest,
  MakePdfFromPicturesResponse,
  TestComposePageData2,
  TestComposePdfData2,
} from '@rka/core-utils'
import { ListDTO, ListQueryParams } from '@rka/db'
import { JobService } from 'libs/back/core/job/src'
import { PDF_JOB_TTL } from '../../config'
import { TABLE_NAME_DOC4S } from '../../database/database.const'
import { JOB_MAKE_PDF, PDF_QUEUE } from '../../job/job.const'
import { Jwt2faAuthGuard } from '../../users/auth/guards/jwt-2fa-auth.guard'
import { SessionService, UserSessionRedisData } from '../../users/auth/services/session.service'
import { User } from '../../users/entities/user.entity'
import { addCompanyToQueryParams } from '../../users/types/company.types'
import { ComposePageService } from '../services/compose-page.service'
import { Doc4sService } from '../services/doc4s.service'
import { DocumentForSignature, DocumentForSignatureListItem, isAllowedToOpenDocument } from '../types/doc4s.types'

@ApiTags( 'Документы на подпись' )
@ApiExtraModels( ListQueryParams, ListDTO )
@UseInterceptors( new ApiResultInterceptor() )
@Controller( 'doc4s' )
@UseGuards( Jwt2faAuthGuard )
export class Doc4sController {
  constructor(
    private doc4s: Doc4sService,
    private composeService: ComposePageService,
    private jobService: JobService,
    private sessionService: SessionService,
  ) {
  }

  @Post( 'get' )
  async get(
    @Headers() headers: any,
    @Body() body: ListQueryParams,
  ): Promise<ListDTO<DocumentForSignature>> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    const user = await User.findByPk( sessionData.userId )
    addCompanyToQueryParams(
      body,
      sessionData.companyId,
      `"${TABLE_NAME_DOC4S}"`,
    )
    const res = await this.doc4s.fetch( body )
    res.data = res.data.filter( ( doc ) => isAllowedToOpenDocument( doc, user ) )
    return res
  }

  @Post( 'list' )
  async list(
    @Headers() headers: any,
    @Body() body: ListQueryParams,
  ): Promise<ListDTO<DocumentForSignatureListItem>> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers, true )
    const user = await User.findByPk( sessionData.userId )
    addCompanyToQueryParams(
      body,
      sessionData.companyId,
      `"${TABLE_NAME_DOC4S}"`,
    )
    const res = await this.doc4s.list( body )
    res.data = res.data.filter( ( doc ) => isAllowedToOpenDocument( doc, user ) )
    return res
  }

  @Post( 'upsert' )
  async addOrUpdate(
    @Headers() headers: any,
    @Body() body: Partial<DocumentForSignature>,
  ): Promise<DocumentForSignature> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers )
    return this.doc4s.upsert( body, sessionData )
  }

  @Post( 'delete' )
  async delete(
    @Headers() headers: any,
    @Body() body: { ids: number[] },
  ): Promise<number> {
    const sessionData: UserSessionRedisData =
      await this.sessionService.getUserSessionDataFromHeaders( headers )
    return this.doc4s.delete( body.ids, sessionData.companyId )
  }

  @Post( 'compose-pdf' )
  async composePdf(
    @Body() body: MakePdfFromPicturesRequest,
  ): Promise<MakePdfFromPicturesResponse> {
    return this.composeService.makePdfFromPictures( body )
  }

  @Post( 'compose-pdf-job' )
  async composePdfJob(
    @Body() body: MakePdfFromPicturesRequest,
  ): Promise<AddJobResponseItem> {
    const job = await this.jobService.addJob(
      PDF_QUEUE,
      JOB_MAKE_PDF,
      body,
      PDF_JOB_TTL,
      {},
    )
    return this.jobService.jobToAddJobResultDTO( job )
  }

  @Post( 'compose-page-test' )
  async composePageTest(
    @Body() body: ComposeDocumentPageRequest,
  ): Promise<ComposeDocumentPageResponse> {
    return this.composeService.composePage( TestComposePageData2 )
  }

  @Post( 'compose-pdf-test' )
  async composePdfTest(
    @Body() body: MakePdfFromPicturesRequest,
  ): Promise<MakePdfFromPicturesResponse> {
    return this.composeService.makePdfFromPictures( TestComposePdfData2 )
  }
}
