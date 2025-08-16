import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { DateToStrPipe, PagerPanelComponent } from 'libs/front/core/ui/src'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzTableModule } from 'ng-zorro-antd/table'
import { tap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { UserStore } from '../../../shared/store/user.store'
import { BackendRoutes } from '../../../shared/types/backend.routes'
import { FrontendRoutes } from '../../../shared/types/frontend.routes'
import { User } from '../../../shared/types/user.types'
import { EditUserDialogComponent } from './ui/edit-user-dialog/edit-user-dialog.component'

@Component( {
  selector: 'app-settings-users-page',
  standalone: true,
  imports: [
    NzButtonModule,
    NzTableModule,
    EditUserDialogComponent,
    PagerPanelComponent,
    RouterLink,
    DateToStrPipe,
  ],
  templateUrl: './settings-users-page.component.html',
  styleUrl: './settings-users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class SettingsUsersPageComponent
  extends BasePageComponent
  implements OnInit {
  users = inject( UserStore )

  override ngOnInit() {
    super.ngOnInit()
  }

  onUserEdited( user: User ) {
    this.users
      .upsert( this.cfg.config.apiAddress + BackendRoutes.usersUpsert, user )
      .pipe( tap( () => this.auth.updateUserFromUserStore() ) )
      .subscribe()
  }

  protected readonly FrontendRoutes = FrontendRoutes
  protected readonly BackendRoutes = BackendRoutes
}
