import { Route } from '@angular/router'
import { AuthGuard } from '../../shared/guards/auth.guard'
import { FrontendRoutes } from '../../shared/types/frontend.routes'

export const USER_ROUTES: Route[] = [
  {
    path: '',
    //   resolve: baseResolver,   - общий resolver
    children: [
      {
        path: FrontendRoutes.user.loginRelative,
        loadComponent: () =>
          import('./login-page/login-page.component').then(
            ( m ) => m.LoginPageComponent,
          ),
        title: 'Вход',
      },
      {
        path: FrontendRoutes.user.registerRelative,
        loadComponent: () =>
          import('./register-page/register-page.component').then(
            ( m ) => m.RegisterPageComponent,
          ),
        title: 'Регистрация',
      },
      // {
      //   path: FrontendRoutes.user.profile,
      //   loadComponent: () => import('./profile-page/profile-page.component').then( m => m.ProfilePageComponent ),
      //   title: makeTitle( 'Профиль' ),
      // },
      {
        path: FrontendRoutes.user.forgotPasswordRelative,
        loadComponent: () =>
          import('./forgot-password-page/forgot-password-page.component').then(
            ( m ) => m.ForgotPasswordPageComponent,
          ),
        title: 'Сменить пароль',
      },
      {
        path: FrontendRoutes.user.setPasswordForRouter,
        loadComponent: () =>
          import('./set-password-page/set-password-page.component').then(
            ( m ) => m.SetPasswordPageComponent,
          ),
        title: 'Сменить пароль',
      },
      {
        canActivate: [ AuthGuard ],
        path: FrontendRoutes.user.inviteRelative,
        loadComponent: () =>
          import('./invite-page/invite-page.component').then(
            ( m ) => m.InvitePageComponent,
          ),
        title: 'Пригласить пользователя',
      },
    ],
  },
]
