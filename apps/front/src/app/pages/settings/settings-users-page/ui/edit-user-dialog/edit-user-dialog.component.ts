import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { deepClone } from 'libs/core/core-utils'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzSwitchComponent } from 'ng-zorro-antd/switch'
import { switchMap, tap } from 'rxjs'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { QuestionDialogComponent } from '../../../../../shared/dialog/question-dialog/question-dialog.component'
import { UserStore } from '../../../../../shared/store/user.store'
import { NOTIFICATION_OPTIONS } from '../../../../../shared/types/app.types'
import { BackendRoutes } from '../../../../../shared/types/backend.routes'
import { DefaultUserItem, User } from '../../../../../shared/types/user.types'
import { TurnOff2faDialogComponent } from '../turn-off2fa-dialog/turn-off2fa-dialog.component'
import { TurnOn2faDialogComponent } from '../turn-on2fa-dialog/turn-on2fa-dialog.component'

@Component( {
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: [ './edit-user-dialog.component.scss' ],
  standalone: true,
  imports: [
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    FormsModule,
    NzCheckboxModule,
    NzWaveModule,
    QuestionDialogComponent,
    NzSwitchComponent,
    TurnOn2faDialogComponent,
    TurnOff2faDialogComponent,
  ],
} )
export class EditUserDialogComponent extends BaseComponent implements OnInit {
  isNotAdmin: boolean = false
  isAdmin: boolean = false
  isMe: boolean = false
  isNotMe: boolean = false

  isVisible = false
  @Output() onOK: EventEmitter<User> = new EventEmitter<User>()
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>()
  error = ''
  data!: User

  users = inject( UserStore )
  notifications = inject( NzNotificationService )

  isTwoFactorAuthenticationEnabled = false

  isOnlyAdmin = false

  open( value?: User ) {
    this.isAdmin = this.auth.canEditUsers()
    this.isNotAdmin = !this.isAdmin
    this.isMe = !!value && this.auth.state.user()?.id === value?.id
    this.isNotMe = !this.isMe

    if ( value ) {
      this.data = deepClone( { ...value, password: '' } )
    } else {
      this.data = deepClone( DefaultUserItem )
    }
    if ( !this.data.access ) {
      this.data.access = {}
    }
    this.data.access.isCompanyAdmin = !!this.data.access.isCompanyAdmin
    this.data.access.isSystemAdmin = !!this.data.access.isSystemAdmin
    this.data.access.canSignDocuments = !!this.data.access.canSignDocuments
    this.data.access.canListAll = !!this.data.access.canListAll

    this.data.useOtpOnly = !!this.data.useOtpOnly

    if ( !this.data.settings ) {
      this.data.settings = {}
    }
    if ( !this.data.settings.notifications ) {
      this.data.settings.notifications = {}
    }

    this.data.settings.notifications.emailOnDocApproveResult =
      !!this.data.settings.notifications.emailOnDocApproveResult
    this.data.settings.notifications.emailOnNewDoc4s =
      !!this.data.settings.notifications.emailOnNewDoc4s

    this.isTwoFactorAuthenticationEnabled =
      this.data.isTwoFactorAuthenticationEnabled ?? false

    this.isOnlyAdmin = this.users.getAdminCount() === 1

    this.isVisible = true
  }

  handleOk() {
    this.isVisible = false
    const value = { ...this.data }
    value.isTwoFactorAuthenticationEnabled = undefined
    this.onOK.emit( value )
  }

  handleCancel() {
    this.isVisible = false
    this.onCancel.emit()
  }

  getError(): string {
    if ( this.data.email === '' ) {
      return 'Email не может быть пустым'
    } else {
      const u = this.users.entities().find( ( e ) => e.email === this.data.email )
      return u && u.id !== this.data.id ? 'Логин занят' : ''
    }
  }

  checkData(): boolean {
    this.error = this.getError()
    return this.error === ''
  }

  deleteUser() {
    this.users
      .deleteItems( this.cfg.config.apiAddress + BackendRoutes.usersDelete, [ this.data.id ] )
      .pipe(
        switchMap( () => this.users.load( this.cfg.config.apiAddress + BackendRoutes.usersList, true ) ),
        tap( () => this.handleCancel() ),
      )
      .subscribe()
  }

  @ViewChild( 'turnOn2faDialogComponent' )
  turnOn2faDialogComponent!: TurnOn2faDialogComponent
  @ViewChild( 'turnOff2faDialogComponent' )
  turnOff2faDialogComponent!: TurnOff2faDialogComponent

  twoFactorChange( enabled: boolean ) {
    if ( enabled ) {
      this.turnOn2faDialogComponent.open()
    } else {
      this.turnOff2faDialogComponent.open()
    }
  }

  onOn2faClose( result: boolean ) {
    this.handleCancel()
    if ( result ) {
      this.notifications.success(
        'Двухфакторная аутентификация',
        'Двухфакторная аутентификация включена',
        NOTIFICATION_OPTIONS,
      )
      this.auth.logout().subscribe()
    }
  }

  onOff2faClose( result: boolean ) {
    this.handleCancel()
    if ( result ) {
      this.notifications.success(
        'Двухфакторная аутентификация',
        'Двухфакторная аутентификация отключена',
        NOTIFICATION_OPTIONS,
      )
      this.auth.logout().subscribe()
    }
  }
}
