import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { map, switchMap } from 'rxjs'
import { AppService } from '../../../shared/services/app.service'
import { AuthService } from '../../../shared/services/auth.service'
import { Doc4sStore } from '../../../shared/store/doc4s/doc4s.store'
import { Titles } from '../../../shared/types/titles'

export const doc4sEditResolver = {
  data: ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {
    const doc4s = inject( Doc4sStore )
    const documentId = +route.params[ 'documentId' ]!

    const app = inject( AppService )

    return inject( AuthService )
      .load()
      .pipe(
        switchMap( () => doc4s.load( documentId ) ),
        map( () => {
          app.title.set( Titles.doc4sign( doc4s.num() || doc4s.id() ) )
          if ( doc4s.pictureFilesResponseEntities().length ) {
            doc4s.loadFirstPageIntoImageEditorState( 'response' )
          } else {
            doc4s.loadFirstPageIntoImageEditorState( 'request' )
          }
        } ),
      )
  },
}
