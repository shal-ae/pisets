import { ISendMailOptions } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface'
import { Injectable } from '@nestjs/common'
import { AddJobResponseItem } from '@rka/core-utils'
import { DocumentStatus, StatusMeta } from '@rka/doc4s'
import { JobService } from 'libs/back/core/job/src'
import * as path from 'path'
import { BASE_FRONTEND_URL, MAILER_FROM, MAILER_JOB_TTL, SERVICE_NAME } from '../../config'
import { DocumentForSignatureFields } from '../../doc4s/types/doc4s.types'
import { JOB_SEND_EMAIL, MAILER_QUEUE } from '../../job/job.const'
import { Company } from '../../users/entities/company.entity'
import { User } from '../../users/entities/user.entity'
import { InviteUserQueryDTO, RegisterQueryDTO } from '../../users/types/users.types'
import { getTemplateDir } from '../mail.config'

@Injectable()
export class MailService {
  constructor( private jobService: JobService ) {
  }

  async sendConfirmRegister(
    token: string,
    ipAddress: string,
    data: RegisterQueryDTO,
  ): Promise<AddJobResponseItem | null> {
    if ( !token ) {
      return null
    }

    const urlConfirmAddress = `${BASE_FRONTEND_URL}/user/set-password/${token}?mode=register`

    const sendMailOptions = {
      to: { name: data.name, address: data.email },
      subject: `Регистрация в сервисе ${SERVICE_NAME}`,
      template: path.join( getTemplateDir(), 'user', 'register' ),
      context: {
        username: data.name,
        companyName: data.companyName,
        urlConfirmAddress,
        baseUrl: BASE_FRONTEND_URL,
        ipAddress,
        serviceName: MAILER_FROM,
      },
    }
    return this.sendEmail( sendMailOptions )
  }

  async sendInvitation(
    userId: number,
    token: string,
    ipAddress: string,
    data: InviteUserQueryDTO,
  ): Promise<AddJobResponseItem | null> {
    if ( !userId || !token ) {
      return null
    }
    const user = await User.findByPk( userId, {
      rejectOnEmpty: true,
      raw: true,
    } )
    let company: Company | null = null
    if ( user.companyId ) {
      company = await Company.findByPk( user.companyId, { raw: true } )
    }
    if ( !user ) {
      return null
    }
    const urlConfirmAddress = `${BASE_FRONTEND_URL}/user/set-password/${token}?mode=invite-user`

    const sendMailOptions = {
      to: { name: data.name, address: data.email },
      subject: `Приглашение в сервис ${SERVICE_NAME}`,
      template: path.join( getTemplateDir(), 'user', 'invite' ),
      context: {
        username: data.name,
        invitor: user.name,
        companyName: company?.name || 'Писец',
        urlConfirmAddress,
        baseUrl: BASE_FRONTEND_URL,
        ipAddress,
        serviceName: MAILER_FROM,
      },
    }
    return this.sendEmail( sendMailOptions )
  }

  async sendChangePassword(
    userId: number,
    token: string,
    ipAddress: string,
  ): Promise<AddJobResponseItem | null> {
    if ( !userId || !token ) {
      return null
    }
    const user = await User.findByPk( userId, {
      rejectOnEmpty: true,
      raw: true,
    } )
    if ( !user ) {
      return null
    }
    const urlConfirmAddress = `${BASE_FRONTEND_URL}/user/set-password/${token}?mode=change-password`

    const sendMailOptions = {
      to: { name: user.name, address: user.email },
      subject: `Запрос на изменение пароля`,
      template: path.join( getTemplateDir(), 'user', 'change-password' ),
      context: {
        username: user.name,
        urlConfirmAddress,
        baseUrl: BASE_FRONTEND_URL,
        ipAddress,
        serviceName: MAILER_FROM,
      },
    }
    return this.sendEmail( sendMailOptions )
  }

  async sendChangeStatusToAuthor(
    doc: DocumentForSignatureFields,
    userEMail: string,
  ): Promise<AddJobResponseItem | null> {
    if ( !doc.authorId ) {
      return null
    }
    const user = await User.findByPk( doc.authorId, {
      rejectOnEmpty: true,
      raw: true,
    } )
    if (
      user.email === userEMail ||
      !user.settings?.notifications?.emailOnDocApproveResult
    ) {
      return null
    }
    const statusName = StatusMeta[ doc.status as DocumentStatus ].name
    const sendMailOptions = {
      to: { name: user.name, address: user.email },
      subject: `Статус запроса  № ${doc.id} - ${statusName}`,
      template: path.join( getTemplateDir(), 'doc4s', 'doc4s-change-status' ),
      context: {
        userName: user.name,
        requestNum: doc.id,
        subject: doc.subject,
        documentStr: this.docToStr( doc ),
        statusName,
        counterparty: doc.counterparty,
        baseUrl: BASE_FRONTEND_URL,
        urlRequestAddress: this.urlRequestAddressOfDoc4s( doc ),
        serviceName: MAILER_FROM,
      },
    }
    return this.sendEmail( sendMailOptions )
  }

  async sendNewDoc4sToSigners(
    companyId: number,
    doc: DocumentForSignatureFields,
    userEMail: string,
  ): Promise<AddJobResponseItem> {
    if ( !doc.authorId ) {
      return null
    }
    const user = await User.findByPk( doc.authorId, {
      rejectOnEmpty: true,
      raw: true,
    } )

    if ( !companyId ) {
      return null
    }

    const signers = await this.getUsersWithSignAccess( companyId, userEMail )
    if ( !signers.length ) {
      return null
    }

    const statusName = StatusMeta[ doc.status as DocumentStatus ].name
    const sendMailOptions: ISendMailOptions = {
      to: signers.map( ( e ) => ({ name: e.name, address: e.email }) ),
      subject: `Новый запрос № ${doc.id}`,
      template: path.join( getTemplateDir(), 'doc4s', 'doc4s-new' ),
      context: {
        userName: user.name,
        requestNum: doc.id,
        subject: doc.subject,
        documentStr: this.docToStr( doc ),
        statusName,
        counterparty: doc.counterparty,
        baseUrl: BASE_FRONTEND_URL,
        urlRequestAddress: this.urlRequestAddressOfDoc4s( doc ),
        serviceName: MAILER_FROM,
      },
    }
    return this.sendEmail( sendMailOptions )
  }

  private async getUsersWithSignAccess( companyId: number, exceptForUserEMail: string ): Promise<User[]> {
    const res: User[] = []
    if (!companyId) {
      return res
    }

    const u = await User.findAll( { where: { companyId }, raw: true } )
    u.forEach( ( e ) => {
      if (
        e.access?.canSignDocuments &&
        e.email !== exceptForUserEMail &&
        e.settings?.notifications?.emailOnNewDoc4s
      ) {
        res.push( e )
      }
    } )
    return res
  }

  private docToStr( doc: DocumentForSignatureFields ): string {
    const parts: string[] = []
    if ( doc.type ) {
      parts.push( doc.type )
    }
    if ( doc.incomingDocumentNumber ) {
      parts.push( `№ ${doc.incomingDocumentNumber}` )
    }
    if ( doc.incomingDocumentDate ) {
      parts.push( `от ${doc.incomingDocumentDate}` )
    }
    return parts.join( ' ' )
  }

  private urlRequestAddressOfDoc4s( doc: DocumentForSignatureFields ): string {
    return `${BASE_FRONTEND_URL}/sign/doc/${doc.id}`
  }

  private async sendEmail(
    sendMailOptions: ISendMailOptions,
  ): Promise<AddJobResponseItem> {
    const job = await this.jobService.addJob(
      MAILER_QUEUE,
      JOB_SEND_EMAIL,
      sendMailOptions,
      MAILER_JOB_TTL,
    )
    return this.jobService.jobToAddJobResultDTO( job )
  }
}
