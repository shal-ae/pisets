import { HttpClient } from '@angular/common/http'
import { computed, inject } from '@angular/core'
import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals'
import { addEntity, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities'
import {
  ApiResult,
  GetJobRequestDTO,
  GetJobResponseDTO,
  isJobStatusFinished,
  JobAddItem,
  JobItem,
  makeJobId,
} from '@rka/core-utils'
import { defaultIfEmpty, forkJoin, map, Observable, of, switchMap } from 'rxjs'
import { catchError } from 'rxjs/operators'

export const JobStore = signalStore(
  { providedIn: 'root' },
  withEntities<JobItem>(),
  withMethods( ( store, http: HttpClient = inject( HttpClient ) ) => ({
    tick( getJobUrl: string ): Observable<undefined> {
      const dto: GetJobRequestDTO = { jobs: [], statusesOnly: false }
      store
        .entities()
        /** Исключаем завершенные */
        .filter( ( job ) => !isJobStatusFinished( job.status ) )
        .forEach( ( job ) =>
          dto.jobs.push( {
            queue: job.queue,
            jobId: job.jobId,
          } ),
        )
      if ( !dto.jobs.length ) {
        return of( undefined )
      }

      return http
        .post<ApiResult<GetJobResponseDTO>>( getJobUrl, dto )
        .pipe(
          catchError( ( err ) => {
            // patchState(store, setError(err.status + ' ' + err.message))
            return of( undefined )
          } ),
          switchMap( ( res: ApiResult<GetJobResponseDTO> | undefined ) => {
            if ( res ) {
              // fetch jobs successfully
              const obsArray: Observable<any>[] = []
              res.payload.jobs.forEach( ( job ) => {
                const id = makeJobId( job.queue, job.jobId )
                const currentJobItem = store.entityMap()[ id ]!

                if (
                  currentJobItem.status !== 'completed' &&
                  job.status === 'completed'
                ) {
                  if ( currentJobItem.onComplete ) {
                    if ( currentJobItem.removeFromWatchListAfterComplete ) {
                      obsArray.push(
                        currentJobItem.onComplete.pipe(
                          switchMap( () => this.removeJobObservable( id ) ),
                        ),
                      )
                    } else {
                      obsArray.push( currentJobItem.onComplete )
                    }
                  } else {
                    if ( currentJobItem.removeFromWatchListAfterComplete ) {
                      obsArray.push( this.removeJobObservable( id ) )
                    }
                  }
                }

                if (
                  currentJobItem.status !== 'failed' &&
                  job.status === 'failed'
                ) {
                  if ( currentJobItem.onFail ) {
                    if ( currentJobItem.removeFromWatchListAfterFail ) {
                      obsArray.push(
                        currentJobItem.onFail.pipe(
                          switchMap( () => this.removeJobObservable( id ) ),
                        ),
                      )
                    } else {
                      obsArray.push( currentJobItem.onFail )
                    }
                  } else {
                    if ( currentJobItem.removeFromWatchListAfterFail ) {
                      obsArray.push( this.removeJobObservable( id ) )
                    }
                  }
                }

                patchState(
                  store,
                  updateEntity( {
                    id,
                    changes: {
                      status: job.status,
                      result: job.result,
                      progress: job.progress,
                      failedReason: job.failedReason,
                    },
                  } ),
                )
              } )

              if ( !obsArray.length ) {
                return of( undefined )
              }
              return forkJoin( obsArray ).pipe(
                defaultIfEmpty( {} ),
                map( () => undefined ),
              )
            } else {
              return of( undefined )
            }
          } ),
        )
    },

    addToWatchList( jobAddItem: JobAddItem ): void {
      const id = makeJobId( jobAddItem.queue, jobAddItem.jobId )
      const item: JobItem = {
        ...jobAddItem,
        id,
      }
      patchState( store, removeEntity( id ) )
      patchState( store, addEntity( item ) )
    },

    removeJobObservable( id: string ): Observable<void> {
      this.removeFromWatchList( id )
      return of( undefined )
    },

    removeFromWatchList( id: string ): void {
      patchState( store, removeEntity( id ) )
    },

    getJobData( jobId: string ): JobItem | undefined {
      return store.entityMap()[ jobId ]
    },
  }) ),
  withComputed( ( { entities } ) => ({
    jobsActive: computed( () => entities().filter( ( e ) => e.status === 'active' ) ),
    jobsNotFinished: computed( () =>
      entities().filter( ( e ) => !isJobStatusFinished( e.status ) ),
    ),
  }) ),
)
