import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AutoFocusDirective } from 'libs/front/core/ui/src'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { tap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { UserService } from '../../../shared/services/user.service'
import { NOTIFICATION_OPTIONS } from '../../../shared/types/app.types'
import { FrontendRoutes } from '../../../shared/types/frontend.routes'
import { UserTokenType } from '../../../shared/types/user.types'
import { UserDialogCaptionComponent } from '../ui/user-dialog-caption/user-dialog-caption.component'

@Component( {
  selector: 'app-set-password-page',
  standalone: true,
  imports: [
    NzButtonModule,
    NzInputDirective,
    NzInputGroupComponent,
    ReactiveFormsModule,
    UserDialogCaptionComponent,
    FormsModule,
    AutoFocusDirective,
  ],
  templateUrl: './set-password-page.component.html',
  styleUrls: [ './../user.scss', './set-password-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class SetPasswordPageComponent extends BasePageComponent {
  @Input() token!: string
  @Input() mode!: UserTokenType

  password = ''
  passwordConfirmation = ''
  error = ''

  userService = inject( UserService )
  notifications = inject( NzNotificationService )

  submit() {
    if ( this.password !== this.passwordConfirmation ) {
      this.error = 'Пароли не совпадают.'
      return
    }
    if ( !this.password ) {
      this.error = 'Пароли не может быть пустым.'
      return
    }
    return this.userService
      .setPassword( this.token, this.password, this.mode )
      .pipe(
        tap( ( data ) => {
          if ( data.ok ) {
            this.notifications.success(
              'Пароль установлен',
              'Рекомендуется настроить двухфакторную аутентификацию через профиль пользователя',
              NOTIFICATION_OPTIONS,
            )
            this.router.navigate( [ FrontendRoutes.user.login ] ).then()
          } else {
            const err = data.error?.message || 'Ошибка'
            this.notifications.error(
              'Установка пароля',
              err,
              NOTIFICATION_OPTIONS,
            )
            this.error = err
            this.cdr.markForCheck()
          }
        } ),
      )
      .subscribe()
  }

  cancel() {
    this.router.navigate( [ FrontendRoutes.home ] ).then()
  }
}
