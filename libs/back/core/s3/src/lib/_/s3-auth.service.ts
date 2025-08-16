// import { Injectable } from '@nestjs/common';
// import { User } from '../../users/entities/user.entity';
// import { UrlS3Info } from '../types/sign-url.types';
// import {
//   BACKEND_URL_FILES_PREFIX,
//   S3_BUCKET_NAME,
//   S3_SIGNED_URL_TTL,
// } from '../../config';
//
// @Injectable()
// export class S3AuthService {
//   async canAccessUrl(url: string, user: User): Promise<boolean> {
//     return true;
//   }
//
//   urlToS3(url: string): UrlS3Info | null {
//     if (url.startsWith(BACKEND_URL_FILES_PREFIX)) {
//       return {
//         bucket: S3_BUCKET_NAME,
//         key: url.substring(BACKEND_URL_FILES_PREFIX.length),
//         ttl: S3_SIGNED_URL_TTL,
//       };
//     } else {
//       return null;
//     }
//   }
// }
