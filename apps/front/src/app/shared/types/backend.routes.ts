import { Environment } from '../environment/environment'

export const BackendRoutes = {
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  authRefresh: '/api/auth/refresh',
  authGenerate2faCode: '/api/auth/2fa/generate',
  authTurn2fa: '/api/auth/2fa/turn',
  authLogin2fa: '/api/auth/2fa/login',

  usersList: '/api/users/list',
  usersUpsert: '/api/users/upsert',
  usersDelete: '/api/users/delete',

  usersForgotPassword: '/api/users/change-password',
  usersRegister: '/api/users/register',
  usersInviteUser: '/api/users/invite',
  usersSetPassword: '/api/users/set-password',

  stampsList: '/api/edit/stamp/list',
  stampsUpsert: '/api/edit/stamp/upsert',
  stampsDelete: '/api/edit/stamp/delete',
  stampsUpload: '/api/edit/stamp/upload',

  doc4sGet: '/api/doc4s/get',
  doc4sList: '/api/doc4s/list',
  doc4sUpsert: '/api/doc4s/upsert',
  doc4sDelete: '/api/doc4s/delete',

  doc4sComposePdf: '/api/doc4s/compose-pdf',
  doc4sComposePdfJob: '/api/doc4s/compose-pdf-job',

  fileUpload: '/api/files/upload',
  fileUploadToJob: '/api/files/upload-to-job',
  getJob: '/api/job/get',


  //  через Proxy ----------------------------------------------------
  employee: `${Environment.apiAddressErp}/api/erp/employee/`,
  organization: `${Environment.apiAddressErp}/api/erp/organization/`,
  stamp: `${Environment.apiAddressErp}/api/erp/stamp/`,
  fileFolder: `${Environment.apiAddressErp}/api/erp/file-folder/`,
  //  через Proxy ----------------------------------------------------
}

export const BackendRoutes1C = {
  list: '/list/',
}

export function stampSrcToBackendLink( src: string ): string {
  return `/files/private/stamps/${src}`
}

export function docSrcToBackendLink( src: string ): string {
  if ( !src.startsWith( '/' ) ) {
    src = '/' + src
  }
  return `/files${src}`
}

export function backendLink( src: string, suffix = '' ): string {
  return `/files/${suffix}${src}`
}
