import { isPlatformBrowser } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AppConfig } from '../environment/app-config.types'

@Injectable( { providedIn: 'root' } )
export class ConfigService {
  readonly config$: BehaviorSubject<AppConfig | undefined> = new BehaviorSubject<AppConfig | undefined>( undefined )

  constructor( private httpClient: HttpClient, @Inject( PLATFORM_ID ) private platformId: any ) {
    if ( !isPlatformBrowser( this.platformId ) ) {
      this.config$.next( {
        apiAddress: process.env[ 'SSR_FRONTEND_API_ADDRESS' ] || '',
        ssrApiAddress: process.env[ 'SSR_BACKEND_API_ADDRESS' ] || '',
        refreshTokenIntervalSec: 600,
        apiAddressErp: '',
        localErpFilesBackend: '',
      } )
      // if ( !this.config.apiAddress || !this.config.ssrApiAddress ) {
      //   throw Error( 'init config error' )
      // }
      // if ( this.config.apiAddress ) {
      //   console.log( 'SSR', this.config.apiAddress, this.config.ssrApiAddress )
      // }
    }
  }

  init(): Observable<AppConfig> {
    if ( this.config$.value ) {
      return of( this.config$.value )
    }
    if ( isPlatformBrowser( this.platformId ) ) {
      return this.httpClient.get<AppConfig>( './app-config/app-config.json' )
        .pipe(
          tap( data => this.config$.next( data ) ),
        )
    } else {
      throw Error( 'init config error' )
    }
  }

  get config(): AppConfig {
    return this.config$.value!
  }

  /**
   * Проверка, это пререндер или нет.
   *
   * Во время пререндера в `apiAddress` будет пустая строка, так как при запуске
   * пререндера на гитхабе `.env` файла не будет.
   *
   * В резольверах страниц, указанных в `prerender.txt`
   * (а также в других местах формирования html)
   * нужно проверять, это пререндер или нет.
   *
   * Если это пререндер, то вместо обращений по api нужно вернуть
   * fallback значения для пререндера таких страниц
   *
   * @returns {boolean}
   */
  get isPrerender(): boolean {
    return this.config$.value?.apiAddress === ''
  }
}
