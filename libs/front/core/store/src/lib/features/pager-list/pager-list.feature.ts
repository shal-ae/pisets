import { HttpClient } from '@angular/common/http'
import { computed, inject } from '@angular/core'
import {
  patchState,
  signalStore,
  signalStoreFeature,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals'
import { EntityId, removeAllEntities, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities'
import { ApiResult } from '@rka/core-utils'
import { map, Observable, of, tap } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { DirtyState, setDirty, setNotDirty } from '../dirty-status.feature'
import { LoadStatus, setError, setIdle, setLoaded, setLoading, withLoadStatus } from '../load-status.feature'
import { PagerListService } from './pager-list.service'
import {
  defaultPagerListState,
  Entity,
  PagerListServiceRequest,
  PagerListServiceResponse,
  PagerListState,
} from './pager-list.types'
import { PagerConfig } from './pager.types'

type PagerConfigState = { pagerConfig: PagerConfig | null };

export function withPagerList<T extends Entity>( config: PagerConfig ) {
  return signalStoreFeature(
    {
      state: type<{
        entityMap: Record<EntityId, T>;
        ids: EntityId[];
        loadStatus: LoadStatus;
      }>(),
      signals: type<{}>(),
      methods: type<{}>(),
    },
    withState<PagerListState>( defaultPagerListState( config ) ),
    withState<DirtyState>( { dirty: true } ),

    withMethods(
      (
        store,
        pagerService = inject( PagerListService ),
        http = inject( HttpClient ),
      ) => ({
        load( url: string, reloadIfNotDirty = false ): Observable<void> {
          if ( !store.dirty() && !reloadIfNotDirty ) {
            return of( undefined )
          }
          patchState( store, setLoading() )

          const listState: PagerListServiceRequest = {
            filters: store.filters(),
            order: store.order(),
            itemsOnPage: store.itemsOnPage(),
            page: store.page(),
          }
          return pagerService.fetch<T>( url, config, listState ).pipe(
            catchError( ( err ) => {
              patchState( store, setError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map( ( res: PagerListServiceResponse<T> | undefined ) => {
              if ( res ) {
                let pageCount = 1
                if ( res.total && store.itemsOnPage() ) {
                  pageCount = Math.ceil( res.total / store.itemsOnPage() )
                }
                patchState(
                  store,
                  setAllEntities( res.data ),
                  setLoaded(),
                  setNotDirty(),
                  { total: res.total },
                  { pageCount },
                )
                // console.log(res.data);
                // console.log(store.entityMap());
              }
            } ),
          )
        },

        upsert( url: string, entity: Partial<T>, setDirtyStatus = true ): Observable<void> {
          if ( !url ) {
            console.error( 'Upsert URL is required' )
            return of( undefined )
          }
          return http.post<ApiResult<T>>( url, entity ).pipe(
            catchError( ( err ) => {
              patchState(
                store,
                setError( err.status + ' ' + err.message ),
                setDirty(),
              )
              return of( undefined )
            } ),
            map( ( res: ApiResult<T> | undefined ) => {
              if ( res ) {
                patchState( store, setEntity( res.payload ) )
                if ( setDirtyStatus ) {
                  patchState( store, setDirty() )
                }
              }
            } ),
          )
        },

        deleteItems( url: string, ids: number[] ): Observable<number | undefined> {
          if ( !url ) {
            console.error( 'Delete URL is required' )
            return of( undefined )
          }
          return http.post<ApiResult<number>>( url, { ids } ).pipe(
            catchError( ( err ) => {
              patchState( store, setError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map( ( res: ApiResult<number> | undefined ) => res?.payload ),
            tap( () => patchState( store, setDirty() ) ),
          )
        },

        reset() {
          patchState(
            store,
            removeAllEntities(),
            setIdle(),
            setDirty(),
            defaultPagerListState( config ),
          )
        },

        setPage( page: number ): void {
          patchState( store, { page }, setDirty() )
        },

        setItemsOnPage( itemsOnPage: number ): void {
          patchState( store, { itemsOnPage }, setDirty() )
        },

        setSimpleOrder( simpleOrder: string ): void {
          const order: string[] = simpleOrder ? [ simpleOrder ] : []
          patchState( store, { order }, setDirty() )
        },
      }),
    ),

    withState<PagerConfigState>( { pagerConfig: null } ),
    withHooks( {
      onInit( store ) {
        patchState( store, { pagerConfig: config } )
      },
    } ),
    withComputed( ( { pagerConfig, order } ) => ({
      config: computed( (): PagerConfig => pagerConfig()! ),
      simpleSort: computed( (): string => {
        if ( !order() || !order().length ) {
          return ''
        }
        return order()[ 0 ]
      } ),
    }) ),
  )
}

export interface DummyEntity {
  id: number;
}

export const DummyConfig: PagerConfig = {
  getListUrl: '',
}
export const PagerStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withEntities<DummyEntity>(),
  withLoadStatus(),
  withPagerList<DummyEntity>( DummyConfig ),
)

export type PagerStore = InstanceType<typeof PagerStore>;
