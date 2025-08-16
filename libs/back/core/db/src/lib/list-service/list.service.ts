import { Inject, Injectable } from '@nestjs/common'
import { QueryTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { SEQUELIZE } from '../database.providers'
import { ListDTO, ListServiceQueryParams } from './list.types'

@Injectable()
export class ListService {
  constructor( @Inject( SEQUELIZE ) public readonly sequelize: Sequelize ) {
  }

  async list<T extends object>(
    request: ListServiceQueryParams,
  ): Promise<ListDTO<T>> {
    const res: ListDTO<T> = {
      total: null,
      data: [],
    }
    if ( request.countTotal ) {
      const cntSql = `SELECT count(*) as total FROM ${request.tableName} ${
        request.whereClause ?? ''
      }`
      const totalRes = await this.sequelize.query<{ total: number }>( cntSql, {
        type: QueryTypes.SELECT,
      } )
      if ( totalRes?.length ) {
        res.total = +totalRes[ 0 ].total
      }
    }

    const columns = request.columns || 'id'
    let sql = `SELECT ${columns} FROM ${request.tableName} ${
      request.whereClause ?? ''
    } ${request.orderByClause ?? ''} `
    if ( request.offset ) {
      sql += ` OFFSET ${request.offset} `
    }
    if ( request.limit ) {
      sql += ` LIMIT ${request.limit} `
    }
    res.data = await this.sequelize.query( sql, { type: QueryTypes.SELECT } )

    return res
  }
}
