import { FitEnum } from 'sharp'
import { ThumbnailItem } from './thumbnails'

export interface FileUploadRequestBody {
  options: string;
}

export type FileName = '%md5%' | '%random%' | '%original%' | string;

export type SubfolderPolicy = '' | 'md5_2/2';

export interface FileUploadOptions {
  destFolder: string;
  name: FileName;
  subfolderPolicy: SubfolderPolicy;
  returnOriginalImageMetadata?: boolean;
  saveMetaJsonFile?: boolean;
  meta?: never;
  convertFromPdf?: boolean;
  convertFromPdfOptions?: ConvertFromPdfOptions;
  makeThumbs?: boolean;
  thumbnails?: ThumbnailItem[];
  convertOfficeFileToPdf?: boolean;
  uploadToS3?: boolean;
}

export const DEFAULT_FILE_UPLOAD_OPTIONS_FORMAT: ConvertFromPdfTargetFileFormat[] =
  [ 'jpg', 'png' ]

export const DEFAULT_FILE_UPLOAD_OPTIONS: FileUploadOptions = {
  destFolder: 'public',
  name: '%md5%',
  subfolderPolicy: '',
  saveMetaJsonFile: false,
  convertFromPdf: false,
  convertFromPdfOptions: {
    format: DEFAULT_FILE_UPLOAD_OPTIONS_FORMAT,
    density: 300,
    width: 2480,
    height: 3508,
    preserveAspectRatio: true,
    quality: 0,
    resizeThreshold: 2,
    fit: 'contain',
  },
  makeThumbs: false,
}

export type ConvertFromPdfTargetFileFormat = 'jpg' | 'png';

export interface ConvertFromPdfOptions {
  density?: number;
  format?: ConvertFromPdfTargetFileFormat | ConvertFromPdfTargetFileFormat[];
  width?: number;
  height?: number;
  preserveAspectRatio?: boolean;
  quality?: number;

  resizeThreshold?: number;
  fit?: keyof FitEnum;
}
