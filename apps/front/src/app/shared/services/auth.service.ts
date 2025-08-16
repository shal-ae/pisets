import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { patchState, signalState } from '@ngrx/signals'
import { ApiResult } from '@rka/core-utils';
import { LocalstorageService } from '@rka/ui';
import { filter, map, Observable, of, switchMap } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Doc4sListStore } from '../store/doc4s.list.store'
import { StampStore } from '../store/stamp.store'
import { UserStore } from '../store/user.store'
import {
  AUTH_LOCAL_STORAGE_KEY, AUTH_LOCAL_STORAGE_KEY_LAST_USER,
  AuthStateModel,
  AuthStateModelDefaults,
  Generate2faResultDTO,
  LoginResultDTO,
  set2faRequestDTO,
} from '../types/auth.types'
import { BackendRoutes } from '../types/backend.routes'
import { ConfigService } from './config.service'

@Injectable( { providedIn: 'root' } )
export class AuthService {
  protected readonly router: Router = inject( Router )
  stamp = inject( StampStore )
  users = inject( UserStore )
  doc4sList = inject( Doc4sListStore )
  cfg = inject( ConfigService )

  localStorageService = inject( LocalstorageService )

  http = inject( HttpClient )

  state = signalState<AuthStateModel>( AuthStateModelDefaults )

  readFromLocalStorage(): AuthStateModel {
    const d: AuthStateModel = JSON.parse(
      this.localStorageService.getItem( AUTH_LOCAL_STORAGE_KEY ) ||
      JSON.stringify( AuthStateModelDefaults ),
    )
    patchState( this.state, { ...d, error: '' } )
    return d
  }

  private setLastUsername() {
    const username = this.state().user?.email || ''
    if (username) {
      this.localStorageService.setItem(AUTH_LOCAL_STORAGE_KEY_LAST_USER, username)
    }
  }

  getLastUsername(): string {
    return this.localStorageService.getItem(AUTH_LOCAL_STORAGE_KEY_LAST_USER) ?? ''
  }

  load(): Observable<void> {
    const d = this.readFromLocalStorage()
    if ( d.user ) {
      // return this.loadStoresForAuthorizedUser()
      return this.refreshAccessTokenIfNeeded().pipe(
        switchMap( () => this.loadStoresForAuthorizedUser() ),
      )
    } else {
      this.resetStores()
      return of( undefined )
    }
  }

  updateUserFromUserStore(): void {
    const id = this.state.user()?.id
    if ( id ) {
      const user = this.users.entityMap()[ id ]
      if ( user ) {
        patchState( this.state, { user } )
        this.saveStateToLocalStorage()
      }
    }
  }

  private saveStateToLocalStorage(): void {
    this.localStorageService.setItem(
      AUTH_LOCAL_STORAGE_KEY,
      JSON.stringify( this.state() ),
    )
  }

  setAuthState( d: AuthStateModel ) {
    patchState( this.state, d )
    this.saveStateToLocalStorage()
  }

  logoutState(): void {
    this.setAuthState( AuthStateModelDefaults )
  }

  loginState( payload: LoginResultDTO, need2FA = false ) {
    this.setAuthState( {
      user: need2FA ? null : payload.user,
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      connecting: false,
      error: '',
      access_token_issued: payload.access_token_issued,
      refresh_token_issued: payload.refresh_token_issued,
    } )
    this.setLastUsername()
  }

  /**
   * Выполняет вход по логину и паролю.
   * Если авторизация успешна и у пользователя выключена 2FA -
   * устанавливает STATE c User и загружает справочники
   * Если включена 2FA - STATE устанавливается c User = null, возвращает LoginResultDTO
   *
   * */
  login(
    email: string,
    password: string,
  ): Observable<LoginResultDTO | undefined> {
    patchState( this.state, ( state ) => ({
      ...state,
      connecting: true,
      error: 'Подключение...',
    }) )
    let result: LoginResultDTO | undefined
    return this.http
      .post<ApiResult<LoginResultDTO>>( this.cfg.config.apiAddress + BackendRoutes.authLogin, {
        email,
        password,
      } )
      .pipe(
        catchError( ( err ) => {
          let errMsg
          if ( 401 === err.status ) {
            errMsg = 'Неверный логин/пароль'
          } else if ( 0 === err.status ) {
            errMsg = 'Ошибка подключения к серверу'
          } else {
            errMsg = err.status + ' - ' + err.statusText
          }
          this.setAuthState( { ...AuthStateModelDefaults, error: errMsg } )
          return of( undefined )
        } ),
        map( ( data: ApiResult<LoginResultDTO> | undefined ) => data?.payload ),
        switchMap( ( data ) => {
          result = data
          if ( !result ) {
            return of( undefined )
          }
          if ( result.user.isTwoFactorAuthenticationEnabled ) {
            this.loginState( result, true )
            return of( undefined )
          } else {
            this.loginState( result )
            return this.loadStoresForAuthorizedUser()
          }
        } ),
        map( () => result ),
      )
  }

  login2fa(
    email: string,
    twoFactorAuthenticationCode: string,
  ): Observable<LoginResultDTO | undefined> {
    patchState( this.state, () => ({
      connecting: true,
      error: 'Подключение...',
    }) )

    let result: LoginResultDTO | undefined
    return this.http
      .post<ApiResult<LoginResultDTO>>( this.cfg.config.apiAddress + BackendRoutes.authLogin2fa, {
        email,
        twoFactorAuthenticationCode,
      } )
      .pipe(
        catchError( ( err ) => {
          //        console.log('before 2fa - 3', this.state()) - обнуляется ???
          let errMsg
          if ( 401 === err.status ) {
            errMsg = 'Неверный логин/пароль'
          } else if ( 0 === err.status ) {
            errMsg = 'Ошибка подключения к серверу'
          } else {
            errMsg = err.status + ' - ' + err.statusText
          }
          patchState( this.state, () => ({
            connecting: false,
            error: errMsg,
            user: null,
          }) )
          this.saveStateToLocalStorage()
          //throw err
          return of( undefined )
        } ),
        map( ( data: ApiResult<LoginResultDTO> | undefined ) => data?.payload ),
        switchMap( ( data ) => {
          result = data
          if ( result ) {
            this.loginState( result )
            return this.loadStoresForAuthorizedUser()
          } else {
            return of( undefined )
          }
        } ),
        map( () => result ),
      )
  }

  generate2fa(): Observable<Generate2faResultDTO | undefined> {
    return this.http
      .post<ApiResult<Generate2faResultDTO>>( this.cfg.config.apiAddress + BackendRoutes.authGenerate2faCode, {} )
      .pipe(
        catchError( ( err ) => {
          return of( undefined )
        } ),
        map( ( data ) => data?.payload ),
      )
  }

  turn2fa( code: string, enable: boolean ): Observable<boolean | undefined> {
    const requestDTO: set2faRequestDTO = {
      twoFactorAuthenticationCode: code,
      enable,
    }
    return this.http
      .post<ApiResult<boolean>>( this.cfg.config.apiAddress + BackendRoutes.authTurn2fa, requestDTO )
      .pipe(
        catchError( ( err ) => {
          return of( undefined )
        } ),
        map( ( data ) => data?.payload ),
      )
  }

  refreshAccessTokenIfNeeded(): Observable<void> {
    if ( !this.state.user() ) {
      return of( undefined )
    }
    const tokenIssued = this.state.access_token_issued()
      ? new Date( this.state.access_token_issued()! ).getTime()
      : 0
    const timeNow = new Date().getTime()

    if ( timeNow - tokenIssued > this.cfg.config.refreshTokenIntervalSec * 1000 ) {
      return this.refreshToken()
    }
    return of( undefined )
  }

  private refreshToken(): Observable<void> {
    if ( this.state.user() ) {
      return this.http
        .post<ApiResult<LoginResultDTO>>( this.cfg.config.apiAddress + BackendRoutes.authRefresh, {} )
        .pipe(
          catchError( ( err ) => {
            this.logoutState()
            throw err
          } ),
          filter( ( data ) => data.success ),
          map( ( data: ApiResult<LoginResultDTO> ) => {
            this.loginState( data.payload )
          } ),
        )
    } else {
      this.logoutState()
      return of( undefined )
    }
  }

  loadStoresForAuthorizedUser(): Observable<void> {
    return this.stamp.load( this.cfg.config.apiAddress + BackendRoutes.stampsList, true ).pipe(
      switchMap( () => this.users.load( this.cfg.config.apiAddress + BackendRoutes.usersList, true ) ) )
  }

  private resetStores(): void {
    this.stamp.reset()
    this.users.reset()
    this.doc4sList.reset()
  }

  logout(): Observable<any> {
    return this.http
      .post<ApiResult<boolean>>( this.cfg.config.apiAddress + BackendRoutes.authLogout, {} )
      .pipe(
        catchError( ( err ) => {
          this.logoutState()
          throw err
        } ),
        filter( ( data: ApiResult<boolean> ) => data.success ),
        map( ( data ) => data.payload ),
        map( () => {
          this.router.navigate( [ '/' ] ).then()
          this.logoutState()
        } ),
      )
  }

  canEditUsers(): boolean {
    const user = this.state.user()
    if ( !user ) {
      return false
    }
    return !!(user.access?.isSystemAdmin || user.access?.isCompanyAdmin)
  }

  canDeleteDocs(): boolean {
    const user = this.state.user()
    if ( !user ) {
      return false
    }
    return !!(user.access?.isSystemAdmin || user.access?.isCompanyAdmin)
  }

  canEditStamps(): boolean {
    const user = this.state.user()
    if ( !user ) {
      return false
    }
    return !!(user.access?.isSystemAdmin || user.access?.isCompanyAdmin)
  }

  canRespond(): boolean {
    const user = this.state.user()
    if ( !user ) {
      return false
    }
    return !!user.access?.canSignDocuments
  }

  canListAll(): boolean {
    const user = this.state.user()
    if ( !user ) {
      return false
    }
    return !!(
      user.access?.canListAll ||
      user.access?.isSystemAdmin ||
      user.access?.isCompanyAdmin
    )
  }
}
