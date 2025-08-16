import { isPlatformBrowser } from '@angular/common'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthService } from '../services/auth.service'
import { ConfigService } from '../services/config.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isBrowser = false
  config = inject( ConfigService )

  constructor( @Inject( PLATFORM_ID ) platformId: Object ) {
    this.isBrowser = isPlatformBrowser( platformId )
  }

  auth = inject( AuthService )

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    let cloned

    /**
     * Для SSR будем заменять URL запросов с Environment.apiAddress на Environment.ssrApiAddress
     * (чтобы в докере запросы не шли через NGINX, так как он может быть не запущен)
     *
     * Для браузера будем добавлять заголовки с токенами
     * */
    if ( this.isBrowser ) {
      const snapshot = this.auth.state()
      const accessToken = snapshot.access_token || ''
      const refreshToken = snapshot.refresh_token || ''
      const userData = { id: snapshot.user?.id }

      cloned = req.clone( {
        headers: req.headers
          .append( 'authorization', 'Bearer ' + accessToken )
          .append( 'refresh', refreshToken )
          .append( 'user', JSON.stringify( userData ) ),
      } )
    } else {
      console.log( this.config.config )
      let url = req.url
      if ( url.startsWith( this.config.config.apiAddress ) ) {
        url =
          this.config.config.ssrApiAddress +
          url.substring( this.config.config.apiAddress.length )
      }
      cloned = req.clone( { url } )
    }

    return next.handle( cloned ).pipe(
      catchError( ( err ) => {
        if ( [ 401, 403 ].includes( err.status ) ) {
          this.auth.logoutState()
        } else {
          console.error( err )
        }
        throw err
      } ),
    )
  }

  private getBasicAuthString( username?: string, password?: string ): string {
    if ( username || password ) {
      const u = username + ':' + password
      return 'Basic ' + btoa( unescape( encodeURIComponent( u ) ) )
    } else {
      return ''
    }
  }
}
