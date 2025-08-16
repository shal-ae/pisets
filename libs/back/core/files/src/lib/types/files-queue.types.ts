import { FileUploadOptions, MakePdfOutFileDescriptor } from '@rka/core-utils'

export interface UploadFileJobOptions {
  file: Express.Multer.File | MakePdfOutFileDescriptor;
  options: FileUploadOptions;
}
