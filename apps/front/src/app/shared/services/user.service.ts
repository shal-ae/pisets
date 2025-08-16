import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { ActionResultDTO, ActionResultJobDTO, ApiResult } from 'libs/core/core-utils'
import { map, Observable } from 'rxjs'
import { BackendRoutes } from '../types/backend.routes'
import {
  InviteUserQueryDTO,
  RegisterQueryDTO,
  UserChangePasswordQueryDTO,
  UserSetPasswordQueryDTO,
  UserTokenType,
} from '../types/user.types'
import { ConfigService } from './config.service'

@Injectable( {
  providedIn: 'root',
} )
export class UserService {
  private readonly http = inject( HttpClient )
  private readonly cfg = inject( ConfigService )

  register( data: RegisterQueryDTO ): Observable<ActionResultJobDTO> {
    return this.http
      .post<ApiResult<ActionResultJobDTO>>( this.cfg.config.apiAddress + BackendRoutes.usersRegister, data )
      .pipe( map( ( data ) => data.payload ) )
  }

  invite( data: InviteUserQueryDTO ): Observable<ActionResultJobDTO> {
    return this.http
      .post<ApiResult<ActionResultJobDTO>>( this.cfg.config.apiAddress + BackendRoutes.usersInviteUser, data )
      .pipe( map( ( data ) => data.payload ) )
  }

  forgotPassword( email: string ): Observable<ActionResultJobDTO> {
    const data: UserChangePasswordQueryDTO = { email }
    return this.http
      .post<ApiResult<ActionResultJobDTO>>(
        this.cfg.config.apiAddress + BackendRoutes.usersForgotPassword,
        data,
      )
      .pipe( map( ( data ) => data.payload ) )
  }

  setPassword(
    token: string,
    password: string,
    mode: UserTokenType,
  ): Observable<ActionResultDTO> {
    const endpoint = this.cfg.config.apiAddress + BackendRoutes.usersSetPassword + '/' + mode
    const data: UserSetPasswordQueryDTO = { token, password }
    return this.http
      .post<ApiResult<ActionResultDTO>>( endpoint, data )
      .pipe( map( ( data ) => data.payload ) )
  }
}
