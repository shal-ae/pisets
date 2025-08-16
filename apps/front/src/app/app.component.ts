import { isPlatformBrowser } from '@angular/common'
import { preserveWhitespacesDefault } from '@angular/compiler'
import { afterNextRender, ChangeDetectionStrategy, Component, Inject, inject, PLATFORM_ID } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { JobStore } from 'libs/front/core/store/src'
import { NzAffixComponent } from 'ng-zorro-antd/affix'
import { NzSpinComponent } from 'ng-zorro-antd/spin'
import { interval, switchMap } from 'rxjs'
import {
  EditDoc4sPropsDialogComponent,
} from './pages/doc4s/doc4s-edit-page/ui/edit-doc4s-props-dialog/edit-doc4s-props-dialog.component'
import { BaseComponent } from './shared/controls/base.component'
import { MainMenuComponent } from './shared/controls/components/_/main-menu/main-menu.component'
import { TopPanelComponent } from './shared/controls/components/top-panel/top-panel.component'
import { ProgressPanelComponent } from './shared/controls/ui/progress-panel/progress-panel.component'
import { Doc4sStore } from './shared/store/doc4s/doc4s.store'
import { BackendRoutes } from './shared/types/backend.routes'

@Component( {
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TopPanelComponent,
    NzAffixComponent,
    ProgressPanelComponent,
    NzSpinComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class AppComponent extends BaseComponent {
  doc4s = inject( Doc4sStore )
  jobs = inject( JobStore )

  constructor( @Inject( PLATFORM_ID ) platformId: Object ) {
    super()
    if ( isPlatformBrowser( platformId ) ) {
      afterNextRender( () => {
        this.addSubscription(
          interval( 15000 )
            .pipe( switchMap( ( e ) => this.auth.refreshAccessTokenIfNeeded() ) )
            .subscribe(),
        )

        this.addSubscription(
          interval( 1000 )
            .pipe( switchMap( ( e ) => this.jobs.tick( this.cfg.config.apiAddress + BackendRoutes.getJob ) ) )
            .subscribe(),
        )
      } )
    }
  }

  protected readonly preserveWhitespacesDefault = preserveWhitespacesDefault
}
