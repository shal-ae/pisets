import { ImageMetadataSharp } from '../sharp.types'
import { FileUploadOptions } from './file-upload-request.types'

export interface FileUploadResult {
  requestOptions: FileUploadOptions;
  filePath: string;
  size: number;
  md5: string;
  originalName: string;
  renderedToPdf: boolean;
  pageCount: number;
  thumbs: ThumbsInfo;
  meta: any;
  uploadedAt: Date;
  originalImageMetadata?: ImageMetadataSharp;
}

export interface ThumbsInfo {
  ok: boolean;
  groups?: string[];
  ext?: string[];
}
