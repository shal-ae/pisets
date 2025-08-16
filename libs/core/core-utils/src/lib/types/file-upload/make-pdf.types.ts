import { FileUploadOptions } from './file-upload-request.types'

export const PDF_FILES_TEMP_SUB_DIR = 'pdf'

export interface MakePdfRequestBody {
  folder: string;
  pages: MakePdfPage[];
  outPdfProperties?: PdfProperties;
}

export interface MakeAndSavePdfRequestBody extends MakePdfRequestBody {
  savePdfOptions: FileUploadOptions;
}

export type MakePdfPage = MakePdfPageFromPicture | MakePdfPageFromPdf;

export interface MakePdfPageBase {
  src: string;
}

export interface MakePdfPageFromPicture extends MakePdfPageBase {
  pageWidth?: number;
  pageHeight?: number;
  options?: RenderImageOptions;
}

export interface MakePdfPageFromPdf extends MakePdfPageBase {
  page?: number;
}

export interface PdfProperties {
  width?: number;
  height?: number;
  author?: string;
  title?: string;
  subject?: string;
}

export const DEFAULT_PDF_PROPERTIES: PdfProperties = {
  width: 595,
  height: 842,
  author: 'РПК Аэроплан',
  title: 'PDF',
  subject: '',
}

export interface MakePdfOutFileDescriptor {
  path: string;
  originalname: string;
  size: number;
  filename: string;
}

export interface RenderImageOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scale?: number;
  keepAspectRatio?: boolean;
  opacity?: number;
  align?: string;
}
