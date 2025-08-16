import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { deepClone, makeJobId } from 'libs/core/core-utils'
import { JobStore } from 'libs/front/core/store/src'
import { AutoFocusDirective } from 'libs/front/core/ui/src'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox'
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { map, Observable, of, tap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { UserService } from '../../../shared/services/user.service'
import { NOTIFICATION_OPTIONS } from '../../../shared/types/app.types'
import { FrontendRoutes } from '../../../shared/types/frontend.routes'
import { RegisterQueryDTO } from '../../../shared/types/user.types'
import { UserDialogCaptionComponent } from '../ui/user-dialog-caption/user-dialog-caption.component'

@Component( {
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonModule,
    NzInputDirective,
    NzInputGroupComponent,
    UserDialogCaptionComponent,
    AutoFocusDirective,
  ],
  templateUrl: './register-page.component.html',
  styleUrls: [ './../user.scss', './register-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class RegisterPageComponent extends BasePageComponent {
  @Input() returnUrl = ''

  userService = inject( UserService )
  notifications = inject( NzNotificationService )
  jobs = inject( JobStore )

  error = ''

  data: RegisterQueryDTO = {
    email: '',
    name: '',
    companyName: '',
  }

  submit() {
    if ( !this.data.name ) {
      this.error = 'Имя не может быть пустым'
      return
    }
    if ( !this.data.email ) {
      this.error = 'Не указана электронная почта'
      return
    }
    if ( !this.data.companyName ) {
      this.error = 'Не указано название компании'
      return
    }
    return this.userService
      .register( this.data )
      .pipe(
        tap( ( data ) => {
          if ( data.ok && data.job ) {
            const jobId = makeJobId( data.job.queue, data.job.jobId )
            this.jobs.addToWatchList( {
              ...data.job,
              title: 'Отправка подтверждения',
              onComplete: this.onEmailSendSuccess( jobId ),
              onFail: this.onEmailSendFail( jobId ),
              removeFromWatchListAfterComplete: true,
              removeFromWatchListAfterFail: true,
            } )
            this.router
              .navigate( [ this.returnUrl || FrontendRoutes.user.login ] )
              .then()
          } else {
            this.notifications.error(
              'Отправка подтверждения',
              data.error?.message || 'Ошибка',
              NOTIFICATION_OPTIONS,
            )
          }
        } ),
      )
      .subscribe()
  }

  private onEmailSendSuccess( id: string ): Observable<void> {
    return of( 1 ).pipe(
      map( () => {
        this.notifications.success(
          'Отправка подтверждения',
          'Письмо отправлено успешно',
          NOTIFICATION_OPTIONS,
        )
      } ),
    )
  }

  private onEmailSendFail( id: string ): Observable<void> {
    return of( 1 ).pipe(
      map( () => {
        const data = deepClone( this.jobs.getJobData( id )! )
        this.notifications.error(
          'Отправка подтверждения',
          `Ошибка отправки: ${data.failedReason}`,
          NOTIFICATION_OPTIONS,
        )
      } ),
    )
  }

  cancel() {
    this.router.navigate( [ this.returnUrl || FrontendRoutes.home ] ).then()
  }
}
