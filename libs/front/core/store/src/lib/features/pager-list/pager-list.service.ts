import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { ApiResult } from '@rka/core-utils'
import { map, Observable } from 'rxjs'
import { Entity, PagerListQueryParams, PagerListServiceRequest, PagerListServiceResponse } from './pager-list.types'
import { PagerConfig, PagerFilterItem, PagerOrderItem, PagerStateFilterItem } from './pager.types'

@Injectable( { providedIn: 'root' } )
export class PagerListService {
  private http = inject( HttpClient )

  fetch<T extends Entity>( url: string, config: PagerConfig, request: PagerListServiceRequest ): Observable<PagerListServiceResponse<T>> {
    const orderByArray: string[] = []
    if ( config.orderItems ) {
      request.order.forEach( ( o ) => {
        const orderCfgItem: PagerOrderItem = config.orderItems!.find(
          ( e ) => e.id === o,
        )!
        orderByArray.push( orderCfgItem.sql )
      } )
    }

    const whereArray: string[] = []
    if ( config.filterItems ) {
      request.filters.forEach( ( f: PagerStateFilterItem ) => {
        if ( f.active ) {
          const filterCfgItem: PagerFilterItem = config.filterItems!.find(
            ( e ) => e.id === f.filterId,
          )!
          const sql = filterCfgItem.valueToSql( filterCfgItem, f.value )
          if ( sql ) {
            whereArray.push( ` ( ${sql} ) ` )
          }
        }
      } )
    }

    const params: PagerListQueryParams = {
      whereClause: whereArray.length ? `where ${whereArray.join( ' AND ' )}` : '',
      orderByClause: orderByArray.length
        ? `order by ${orderByArray.join( ',' )}`
        : '',
      offset: ((request.page || 1) - 1) * request.itemsOnPage,
      limit: request.itemsOnPage ?? 0,
      countTotal: true,
    }
    return this.http
      .post<ApiResult<PagerListServiceResponse<T>>>( url, params )
      .pipe( map( ( res: ApiResult<PagerListServiceResponse<T>> ) => res.payload ) )
  }
}
