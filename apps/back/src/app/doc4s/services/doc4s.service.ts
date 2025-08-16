import { Injectable } from '@nestjs/common'
import { ListDTO, ListQueryParams, ListService, ListServiceQueryParams } from 'libs/back/core/db/src'
import { MailService } from '../../mail/services/mail.service'
import { UserSessionRedisData } from '../../users/auth/services/session.service'
import { User } from '../../users/entities/user.entity'
import { Doc4s } from '../entities/doc4s.entity'
import {
  DocumentForSignature,
  DocumentForSignatureListItem,
  ResultFilesResponseCollection,
} from '../types/doc4s.types'

@Injectable()
export class Doc4sService {
  constructor(
    private listService: ListService,
    private mailService: MailService,
  ) {
  }

  async fetch(
    request?: ListQueryParams,
  ): Promise<ListDTO<DocumentForSignature>> {
    const listServiceQueryParams: ListServiceQueryParams = {
      ...request,
      tableName: 'public.doc4s',
      columns: '*',
    }
    const d = await this.listService.list<Doc4s>( listServiceQueryParams )
    return {
      total: d.total,
      data: d.data.map( ( e ) => e.data ),
    }
  }

  async list(
    request?: ListQueryParams,
  ): Promise<ListDTO<DocumentForSignatureListItem>> {
    const listServiceQueryParams: ListServiceQueryParams = {
      ...request,
      tableName: 'public.doc4s',
      columns: '*',
    }
    const d = await this.listService.list<Doc4s>( listServiceQueryParams )
    return {
      total: d.total,
      data: d.data.map( ( e ) => ({
        id: e.data.id,
        num: e.data.num,
        createdAt: e.data.createdAt,
        updatedAt: e.data.updatedAt,
        authorId: e.data.authorId,
        assignedByUserId: e.data.assignedByUserId,
        subject: e.data.subject,
        description: e.data.description,
        type: e.data.type,
        incomingDocumentNumber: e.data.incomingDocumentNumber,
        incomingDocumentDate: e.data.incomingDocumentDate,
        counterparty: e.data.counterparty,
        status: e.data.status,
        [ ResultFilesResponseCollection ]: e.data[ ResultFilesResponseCollection ],
      }) ),
    }
  }

  async delete( ids: number[], companyId: number | null ): Promise<number> {
    const idsToDelete: number[] = []
    for ( const id of ids ) {
      const doc = await Doc4s.findOne( { where: { companyId, id } } )
      if ( doc ) {
        idsToDelete.push( id )
      }
    }
    if ( idsToDelete.length ) {
      return Doc4s.destroy( { where: { id: idsToDelete } } )
    } else {
      return 0
    }
  }

  async upsert(
    body: Partial<DocumentForSignature>,
    sessionData: UserSessionRedisData,
  ): Promise<DocumentForSignature | null> {
    /** userEmail - чтобы не посылать письма себе  */
    const user = await User.findByPk( sessionData.userId )
    if ( !body.id ) {
      body.id = null
      const lastDoc = await Doc4s.findOne( {
        where: { companyId: sessionData.companyId },
        order: [ [ 'id', 'DESC' ] ],
      } )
      body.num = lastDoc ? (lastDoc.data.num || lastDoc.id) + 1 : 1
    } else {
      delete body.num
      delete body.authorId
    }
    delete body.companyId
    delete body.updatedAt
    delete body.createdAt

    let oldStatus: string | null = null

    const [ item, created ] = await Doc4s.findOrBuild( { where: { id: body.id } } )
    if ( !created && item.status ) {
      oldStatus = item.status
    }

    item.set( { ...body, companyId: sessionData.companyId } )
    item.data = { ...item.data, ...body }
    let newItem = await item.save()
    if ( !newItem.data.id ) {
      newItem.data = {
        ...newItem.data,
        id: newItem.id,
        createdAt: newItem.createdAt,
      }
    }

    newItem.updatedAt = new Date()
    newItem.data = { ...newItem.data, updatedAt: new Date() }
    await newItem.save()

    newItem = await Doc4s.findByPk( newItem.id, { raw: true } )

    if (
      !!oldStatus &&
      newItem.status !== oldStatus &&
      [ 'approved', 'declined' ].includes( newItem.status )
    ) {
      await this.mailService.sendChangeStatusToAuthor( newItem.data, user.email )
    }

    if (
      !!oldStatus &&
      newItem.status !== oldStatus &&
      [ 'pending' ].includes( newItem.status )
    ) {
      await this.mailService.sendNewDoc4sToSigners( sessionData.companyId, newItem.data, user.email )
    }
    return newItem.data
  }
}
