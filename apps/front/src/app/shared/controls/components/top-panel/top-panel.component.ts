import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { StatusMeta } from '@rka/doc4s';
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { tap } from 'rxjs'
import {
  EditUserDialogComponent,
} from '../../../../pages/settings/settings-users-page/ui/edit-user-dialog/edit-user-dialog.component'
import { UserStore } from '../../../store/user.store'
import { BackendRoutes } from '../../../types/backend.routes'
import { FrontendRoutes } from '../../../types/frontend.routes'
import { User } from '../../../types/user.types'
import { BaseComponent } from '../../base.component'

@Component( {
  selector: 'app-top-panel',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    FormsModule,
    RouterLink,
    EditUserDialogComponent,
  ],
  templateUrl: './top-panel.component.html',
  styleUrl: './top-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class TopPanelComponent extends BaseComponent {
  @ViewChild( 'editUserDialog' ) editUserDialog!: EditUserDialogComponent

  logout(): void {
    this.auth.logout().subscribe()
  }

  users = inject( UserStore )

  protected readonly FrontendRoutes = FrontendRoutes
  protected readonly StatusMeta = StatusMeta

  clickName() {
    const user = this.auth.state.user()
    if ( user ) {
      this.editUserDialog.open( user )
    }
  }

  onUserEdited( user: User ) {
    this.users
      .upsert( this.cfg.config.apiAddress + BackendRoutes.usersUpsert, user )
      .pipe( tap( () => this.auth.updateUserFromUserStore() ) )
      .subscribe()
  }
}
