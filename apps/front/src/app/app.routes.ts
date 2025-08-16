import { Routes } from '@angular/router'
import { homePageResolver } from './pages/home/home-page/home-page.resolver'
import { FrontendRoutes } from './shared/types/frontend.routes'
import { Titles } from './shared/types/titles'

export const routes: Routes = [
  {
    path: FrontendRoutes.homeRelative,
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home-page/home-page.component').then(
        ( m ) => m.HomePageComponent,
      ),
    resolve: homePageResolver,
    title: Titles.home,
  },
  {
    path: FrontendRoutes.doc4sListRelative,
    loadChildren: () =>
      import('./pages/doc4s/doc4s.routes').then( ( mod ) => mod.DOC4S_ROUTES ),
  },
  {
    path: FrontendRoutes.settingsRelative,
    loadChildren: () =>
      import('./pages/settings/settings.routes').then(
        ( mod ) => mod.SETTINGS_ROUTES,
      ),
  },
  {
    path: FrontendRoutes.user.homeRelative,
    loadChildren: () =>
      import('./pages/user/user.routes').then( ( mod ) => mod.USER_ROUTES ),
  },
]
