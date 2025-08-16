import { Routes } from '@angular/router'
import { AuthGuard } from '../../shared/guards/auth.guard'
import { FrontendRoutes } from '../../shared/types/frontend.routes'
import { Titles } from '../../shared/types/titles'
import { doc4sEditResolver } from './doc4s-edit-page/doc4s-edit.resolver'
import { doc4sListResolver } from './doc4s-list-page/doc4s-list.resolver'

export const DOC4S_ROUTES: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./doc4s-list-page/doc4s-list-page.component').then(
            ( m ) => m.Doc4sListPageComponent,
          ),
        resolve: doc4sListResolver,
        title: Titles.doc4sList,
      },
      {
        path: FrontendRoutes.doc4signForRouter,
        loadComponent: () =>
          import('./doc4s-edit-page/doc4s-edit-page.component').then(
            ( m ) => m.Doc4sEditPageComponent,
          ),
        resolve: doc4sEditResolver,
        title: Titles.doc4sign( 0 ),
      },
    ],
  },
]
