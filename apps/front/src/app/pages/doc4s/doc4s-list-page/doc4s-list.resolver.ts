import { inject } from '@angular/core'
import { patchState } from '@ngrx/signals'
import { switchMap, tap } from 'rxjs'
import { AppService } from '../../../shared/services/app.service'
import { AuthService } from '../../../shared/services/auth.service'
import { ConfigService } from '../../../shared/services/config.service'
import { Doc4sListStore } from '../../../shared/store/doc4s.list.store'
import { BackendRoutes } from '../../../shared/types/backend.routes'
import { Titles } from '../../../shared/types/titles'

export const doc4sListResolver = {
  res: () => {
    const app = inject( AppService )
    const auth = inject( AuthService )
    app.title.set( Titles.home )
    const doc4sListStore = inject( Doc4sListStore )
    const cfg = inject( ConfigService )

    return inject( AuthService )
      .load()
      .pipe(
        tap( () => {
          patchState( doc4sListStore, {
            filters: [
              {
                filterId: 'author',
                active: !auth.canListAll(),
                value: auth.state.user()?.id,
              },
            ],
          } )
        } ),
        switchMap( () => doc4sListStore.load( cfg.config.apiAddress + BackendRoutes.doc4sList, true ) ),
      )
  },
}
