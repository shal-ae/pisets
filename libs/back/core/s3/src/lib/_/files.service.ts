// import * as fs from 'fs'
// import * as path from 'path'
// import { Injectable } from '@nestjs/common'
// import { ConvertPdfResult, ConvertPdfService } from './convert-pdf.service'
// import { ConvertOfficeService, OFFICE_CONVERT_EXT } from './convert-office.service'
// import { FileLocation } from '../../shared/utils/file-location'
// import { DEFAULT_FILE_UPLOAD_OPTIONS, FileUploadOptions } from '../types/file-upload-request.types'
// import { MakePdfOutFileDescriptor } from '../types/make-pdf.types'
// import { ThumbnailItem, THUMBNAILS_DEFAULT } from '../types/thumbnails'
// import { S3Service } from './s3.service'
// import { Job } from 'bullmq'
// import { FileUploadResult } from '../types/file-upload.types'
// import { S3_BUCKET_NAME } from '../../config'
// import { FileUtils, getImageMetadataSharp, resizeImageFileToFileSharp } from '@rka/back-utils'
//
// @Injectable()
// export class FilesService {
//   constructor(
//     private convertPdfService: ConvertPdfService,
//     private convertOfficeService: ConvertOfficeService,
//     private s3: S3Service
//   ) {}
//
//   async saveUploadedFile(
//     file: Express.Multer.File | MakePdfOutFileDescriptor,
//     options: FileUploadOptions,
//     job: Job<any, any, string> | null = null
//   ): Promise<FileUploadResult> {
//     let progress = 0;
//     const s3List: string[] = [];
//     const md5 = FileUtils.md5ofFile(file.path);
//     const fileExt = FileUtils.fileExt(file.originalname).toLowerCase();
//     const originalName = Buffer.from(file.originalname, 'latin1').toString(
//       'utf8'
//     );
//
//     let folder = options.destFolder ?? DEFAULT_FILE_UPLOAD_OPTIONS.destFolder;
//     if (options.subfolderPolicy === 'md5_2/2') {
//       folder = path.join(folder, FileUtils.hashToFileFolder(md5));
//     }
//     const destinationFolder = path.join(FileLocation.getFilesDir(), folder);
//
//     let filename = options.name;
//     if (options.name === '%md5%') {
//       filename = `${md5}.${fileExt}`;
//     } else if (options.name === '%random%') {
//       filename = `${file.filename}.${fileExt}`;
//     } else if (options.name === '%original%') {
//       filename = originalName;
//     }
//
//     const destinationFilename = path.join(destinationFolder, filename);
//     const relativeFilename = path.join(folder, filename);
//
//     FileUtils.createPathForFileIfNotExist(destinationFilename);
//     await FileUtils.copyFile(file.path, destinationFilename);
//     s3List.push(destinationFilename);
//
//     progress += 5;
//     await job?.updateProgress(progress);
//
//     await FileUtils.deleteFile(file.path);
//
//     const res: FileUploadResult = {
//       requestOptions: options,
//       filePath: FileLocation.toUrlPath(relativeFilename),
//       size: file.size,
//       md5,
//       originalName,
//       renderedToPdf: false,
//       thumbs: {
//         ok: false,
//       },
//       pageCount: 0,
//       meta: options.meta,
//       uploadedAt: new Date(),
//     };
//
//     if (
//       options.returnOriginalImageMetadata &&
//       FileUtils.isThumbnailSupportedPicture(destinationFilename)
//     ) {
//       res.originalImageMetadata = await getImageMetadataSharp(
//         destinationFilename
//       );
//     }
//
//     const extForThumbs: string[] = [];
//     const dstFilePathsToMakeThumbs: string[] = [];
//
//     if (FileUtils.isThumbnailSupportedPicture(destinationFilename)) {
//       dstFilePathsToMakeThumbs.push(destinationFilename);
//       extForThumbs.push(fileExt);
//     }
//
//     if (
//       options.convertOfficeFileToPdf &&
//       OFFICE_CONVERT_EXT.includes(fileExt)
//     ) {
//       extForThumbs.push('jpg');
//       const pdfFilePath =
//         FileUtils.fileWithoutExt(destinationFilename) + '.pdf';
//       await this.convertOfficeService.convertOfficeFileToPdf(
//         destinationFilename,
//         pdfFilePath
//       );
//       s3List.push(pdfFilePath);
//
//       progress += 10;
//       await job?.updateProgress(progress);
//
//       if (options.convertFromPdf) {
//         const pdfRes = await this.convertPdfService.convertPdf(
//           pdfFilePath,
//           destinationFolder,
//           FileUtils.fileWithoutExt(filename),
//           options.convertFromPdfOptions
//         );
//         this.getFilePathsToMakeThumbsFromConvertPdfResults(
//           pdfRes,
//           destinationFolder,
//           dstFilePathsToMakeThumbs
//         );
//         res.pageCount = pdfRes.pageCount;
//         res.renderedToPdf = true;
//
//         progress += 10;
//         await job?.updateProgress(progress);
//       }
//     }
//
//     if (fileExt === 'pdf' && options.convertFromPdf) {
//       extForThumbs.push('jpg');
//       const pdfRes = await this.convertPdfService.convertPdf(
//         destinationFilename,
//         destinationFolder,
//         FileUtils.fileWithoutExt(filename),
//         options.convertFromPdfOptions
//       );
//       this.getFilePathsToMakeThumbsFromConvertPdfResults(
//         pdfRes,
//         destinationFolder,
//         dstFilePathsToMakeThumbs
//       );
//       res.pageCount = pdfRes.pageCount;
//
//       progress += 10;
//       await job?.updateProgress(progress);
//     }
//
//     if (options.makeThumbs) {
//       const thumbFiles = await this.makeAllThumbnails(
//         res,
//         dstFilePathsToMakeThumbs,
//         extForThumbs,
//         options.thumbnails || THUMBNAILS_DEFAULT
//       );
//       s3List.push(...dstFilePathsToMakeThumbs);
//       s3List.push(...thumbFiles);
//     }
//
//     const resFileWithoutExt = FileUtils.fileWithoutExt(destinationFilename);
//     if (fileExt !== 'json' && options.saveMetaJsonFile) {
//       const dstJsonFile = `${resFileWithoutExt}.json`;
//       s3List.push(dstJsonFile);
//       fs.writeFileSync(dstJsonFile, JSON.stringify(res, null, 2), 'utf8');
//     }
//
//     if (options.uploadToS3) {
//       const progressBeforeUpload = progress;
//
//       let i = 0;
//       for (const filePath of s3List) {
//         i++;
//         const key = this.dstFilePathToS3Key(filePath);
//
//         if (key) {
//           await this.s3.upload(S3_BUCKET_NAME, filePath, key);
//           progress =
//             progressBeforeUpload +
//             (i / s3List.length) * (100 - progressBeforeUpload);
//           await job?.updateProgress(progress);
//         }
//       }
//     }
//     progress = 100;
//     await job?.updateProgress(progress);
//     return res;
//   }
//
//   private dstFilePathToS3Key(filePath: string): string {
//     const fd = FileLocation.getFilesDir();
//     let key = '';
//     if (filePath.startsWith(fd)) {
//       const k = filePath.substring(fd.length);
//       key = FileLocation.toUrlPath(k)
//         .split('/')
//         .filter((e) => e)
//         .join('/');
//     }
//     return key;
//   }
//
//   private getFilePathsToMakeThumbsFromConvertPdfResults(
//     pdfRes: ConvertPdfResult,
//     dstFolder: string,
//     dstFilePathsToMakeThumbs: string[]
//   ): void {
//     pdfRes.convertResults.forEach((extGroup) => {
//       extGroup.forEach((resItem) => {
//         const dstFile = path.join(dstFolder, resItem.name);
//         if (FileUtils.isThumbnailSupportedPicture(dstFile)) {
//           dstFilePathsToMakeThumbs.push(dstFile);
//         }
//       });
//     });
//   }
//
//   private async makeAllThumbnails(
//     res: FileUploadResult,
//     dstFilePathsToMakeThumbs: string[],
//     extForThumbs: string[],
//     thumbnails: ThumbnailItem[]
//   ): Promise<string[]> {
//     const allThumbnailFiles: string[] = [];
//     try {
//       for (const dstFileForThumbs of dstFilePathsToMakeThumbs) {
//         for (const TH_ITEM of thumbnails) {
//           const fileExt = FileUtils.fileExt(dstFileForThumbs);
//
//           if (extForThumbs.includes(fileExt)) {
//             const fileWithoutExt = FileUtils.fileWithoutExt(dstFileForThumbs);
//             const dstFile = `${fileWithoutExt}.${TH_ITEM.group}.${fileExt}`;
//             await resizeImageFileToFileSharp(
//               dstFileForThumbs,
//               dstFile,
//               TH_ITEM.width,
//               TH_ITEM.height
//             );
//             allThumbnailFiles.push(dstFile);
//           }
//         }
//       }
//       res.thumbs.ok = true;
//       res.thumbs.ext = extForThumbs;
//       res.thumbs.groups = thumbnails.map((e) => e.group);
//     } catch (e) {
//       if (e instanceof Error) {
//         console.error(e.message);
//       }
//     }
//     return allThumbnailFiles;
//   }
// }
