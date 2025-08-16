import { isPlatformBrowser } from '@angular/common'
import { afterNextRender, ChangeDetectionStrategy, Component, Inject, inject, PLATFORM_ID } from '@angular/core'
import { interval, of, switchMap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { Doc4sListStore } from '../../../shared/store/doc4s.list.store'
import { BackendRoutes } from '../../../shared/types/backend.routes'

@Component( {
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class HomePageComponent extends BasePageComponent {
  doc4sList = inject( Doc4sListStore )

  constructor( @Inject( PLATFORM_ID ) platformId: Object ) {
    super()
    if ( isPlatformBrowser( platformId ) ) {
      afterNextRender( () => {
        this.addSubscription(
          interval( 15000 )
            .pipe(
              switchMap( () => {
                if ( this.auth.state.user() ) {
                  return this.doc4sList.load( this.cfg.config.apiAddress + BackendRoutes.doc4sList, true )
                } else {
                  return of( undefined )
                }
              } ),
            )
            .subscribe(),
        )
      } )
    }
  }
}
