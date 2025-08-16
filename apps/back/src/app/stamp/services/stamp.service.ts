import { Injectable } from '@nestjs/common'
import { ListDTO, ListQueryParams, ListService, ListServiceQueryParams } from 'libs/back/core/db/src'

import { TABLE_NAME_STAMP } from '../../database/database.const'
import { Stamp } from '../entities/stamp.entity'
import { StampData } from '../types/stamp.types'

@Injectable()
export class StampService {
  constructor( private readonly listService: ListService ) {
  }

  async list( request?: ListQueryParams ): Promise<ListDTO<StampData>> {
    const listServiceQueryParams: ListServiceQueryParams = {
      ...request,
      tableName: TABLE_NAME_STAMP,
      columns: '*',
    }
    const d = await this.listService.list<Stamp>( listServiceQueryParams )
    return {
      total: d.total,
      data: d.data.map( ( e ) => e.data ),
    }
  }

  async upsert(
    body: Partial<StampData>,
    companyId: number | null,
  ): Promise<StampData | null> {
    if ( !body.id ) {
      body.id = null
    }
    const [ item, created ] = await Stamp.findOrBuild( { where: { id: body.id } } )
    item.set( { data: body, companyId, sort: body.sort } )
    let newItem = await item.save()
    if ( !newItem.data.id ) {
      newItem.data = { ...newItem.data, id: newItem.id }
      await newItem.save()
    }
    newItem = await Stamp.findByPk( newItem.id, { raw: true } )
    return newItem.data
  }

  async delete( ids: number[], companyId: number | null ): Promise<number> {
    const idsToDelete: number[] = []
    for ( const id of ids ) {
      const stamp = await Stamp.findOne( { where: { companyId, id } } )
      if ( stamp ) {
        idsToDelete.push( id )
      }
    }
    if ( idsToDelete.length ) {
      return Stamp.destroy( { where: { id: idsToDelete } } )
    } else {
      return 0
    }
  }
}
