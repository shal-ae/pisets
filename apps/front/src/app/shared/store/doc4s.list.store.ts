import { signalStore, withMethods } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { DocumentStatuses, StatusBooleanData } from 'libs/core/doc4s'
import { PagerConfig, PagerFilterItem, withLoadStatus, withPagerList } from 'libs/front/core/store/src'
import { BackendRoutes } from '../types/backend.routes'
import { DocumentForSignatureListItem } from '../types/doc4s.types'

const CONFIG: PagerConfig = {
  getListUrl: BackendRoutes.doc4sList,
  upsertUrl: BackendRoutes.doc4sUpsert,
  deleteUrl: BackendRoutes.doc4sDelete,

  orderItems: [
    {
      id: 'created desc',
      caption: 'Создан -',
      group: 'createdAt',
      sql: '"createdAt" desc',
    },
    {
      id: 'created asc',
      caption: 'Создан +',
      group: 'createdAt',
      sql: '"createdAt"',
    },
    {
      id: 'updated desc',
      caption: 'Изменён -',
      group: 'updatedAt',
      sql: '"updatedAt" desc',
    },
    {
      id: 'updated asc',
      caption: 'Изменён +',
      group: 'updatedAt',
      sql: '"updatedAt"',
    },
  ],
  defaultOrderItems: [ 'created desc' ],

  itemsOnPageItems: [ 10, 15, 20, 30, 50, 100 ],
  defaultItemsOnPage: 15,

  filterItems: [
    {
      id: 'author',
      caption: 'Автор',
      valueToSql: ( filterItem: PagerFilterItem, value: unknown ) => {
        return value ? `"authorId" = ${value}` : ''
      },
    },
    {
      id: 'search',
      caption: 'Поиск',
      valueToSql: ( filterItem: PagerFilterItem, value: unknown ) => {
        return value
          ? `"subject" ILIKE '%${value}%' OR "incomingDocumentNumber" ILIKE '%${value}%' OR "counterparty" ILIKE '%${value}%'`
          : ''
      },
    },
    {
      id: 'statuses',
      caption: 'Статусы',
      valueToSql: ( filterItem: PagerFilterItem, value: unknown ) => {
        const statusesArray: string[] = []
        const statuses = value as StatusBooleanData
        for ( const st of DocumentStatuses ) {
          if ( statuses[ st ] ) {
            statusesArray.push( st )
          }
        }
        if ( !statusesArray.length ) {
          return ''
        }
        const str = statusesArray.map( ( e ) => `'${e}'` ).join( ',' )
        return `"status" IN ( ${str} )`
      },
    },
  ],

  defaultFilters: [],
}

export const Doc4sListStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withEntities<DocumentForSignatureListItem>(),
  withLoadStatus(),
  withPagerList<DocumentForSignatureListItem>( CONFIG ),
  withMethods( ( store ) => ({
    isAuthorFiltered(): boolean {
      return !!store.filters().find( ( f ) => f.filterId === 'author' && f.active )
    },
  }) ),
)
