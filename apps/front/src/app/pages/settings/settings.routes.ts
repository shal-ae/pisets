import { Routes } from '@angular/router'
import { AuthGuard } from '../../shared/guards/auth.guard'
import { FrontendRoutes } from '../../shared/types/frontend.routes'
import { Titles } from '../../shared/types/titles'
import { settingsStampsPageResolver } from './settings-stamps-page/settings-stamps-page.resolver'
import { settingsUsersPageResolver } from './settings-users-page/settings-users-page.resolver'

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: FrontendRoutes.settingsStampsRelative,
        loadComponent: () =>
          import('./settings-stamps-page/settings-stamps-page.component').then(
            ( m ) => m.SettingsStampsPageComponent,
          ),
        resolve: settingsStampsPageResolver,
        title: Titles.settingsStamps,
      },
      {
        path: FrontendRoutes.settingsUsersRelative,
        loadComponent: () =>
          import('./settings-users-page/settings-users-page.component').then(
            ( m ) => m.SettingsUsersPageComponent,
          ),
        resolve: settingsUsersPageResolver,
        title: Titles.settingsUsers,
      },
    ],
  },
]
