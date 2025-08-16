export const FrontendRoutes = {
  home: '/',
  homeRelative: '',

  doc4sList: '/sign',
  doc4sListRelative: 'sign', // Routes

  settings: '/settings',
  settingsRelative: 'settings',

  doc4signForRouter: 'doc/:documentId',
  doc4sign: ( docId: number ) => `/sign/doc/${docId}`,

  settingsStamps: '/settings/stamp',
  settingsStampsRelative: 'stamp',

  settingsUsers: '/settings/users',
  settingsUsersRelative: 'users',

  user: {
    home: '/user',
    homeRelative: 'user',
    login: '/user/login',
    loginRelative: 'login',
    register: '/user/register',
    registerRelative: 'register',
    forgotPassword: '/user/forgot-password',
    forgotPasswordRelative: 'forgot-password',
    setPassword: '/user/set-password',
    setPasswordForRouter: 'set-password/:token',
    setPasswordRelative: 'set-password',
    invite: '/user/invite',
    inviteRelative: 'invite',
  },
}
