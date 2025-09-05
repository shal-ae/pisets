import { FileUploadResult } from '@rka/core-utils';
import { DocumentStatus } from '@rka/doc4s';
import { ImageDesc } from '../../shared/types/image-desc'
import { User } from '../../users/entities/user.entity'
import { Rect } from './document-page.types'

export type DocumentForSignatureFields = {
  id: number;
  num: number;
  createdAt: Date;
  updatedAt: Date;

  authorId: number;
  companyId?: number;
  assignedByUserId: number;
  subject: string;
  description: string;
  type: string;
  incomingDocumentNumber: string;
  incomingDocumentDate: Date;
  counterparty: string;
  status: string;
  approveComments?: string
};

export function isAllowedToOpenDocument(
  doc: DocumentForSignatureFields,
  user: User,
): boolean {
  return (
    user.access.isCompanyAdmin ||
    user.access.canSignDocuments ||
    doc.authorId === user.id ||
    user.access.canListAll
  )
}

export type DocumentForSignature = DocumentForSignatureFields & {
  [ UploadedFilesRequestCollection ]: UploadedFile[];
  [ PictureFilesRequestCollection ]: DocumentPage[];
  [ UploadedFilesResponseCollection ]: UploadedFile[];
  [ PictureFilesResponseCollection ]: DocumentPage[];
  [ ResultFilesResponseCollection ]: ResultFile[];
  [ StatusesCollection ]: StatusTrackItem[];
};

export type DocumentForSignatureListItem = DocumentForSignatureFields & {
  [ ResultFilesResponseCollection ]: ResultFile[];
};

export interface StampItem {
  id: number;
  imageDesc: ImageDesc;
  position: Rect;
}

export type StampItems = StampItem[];

export interface DocumentPage {
  id: string;
  uploadedFileId: string | null;
  uploadedFilePage: number | null;
  pageImage: ImageDesc | null;
  stamps: StampItems;
  caption?: string;
}

export interface UploadedFile extends FileUploadResult {
  id: string;
  uploadedByUserId: number | null;
  uploadedAt: Date;
}

export interface ResultFile {
  id: string;
  filePath: string;
  title: string;
  generatedByUserId: number | null;
  generatedAt: Date;
}

export interface StatusTrackItem {
  id: string;
  status: DocumentStatus;
  setByUserId: number | null;
  setAt: Date;
}

export const UploadedFilesRequestCollection = 'uploadedFilesRequest'
export const PictureFilesRequestCollection = 'pictureFilesRequest'
export const UploadedFilesResponseCollection = 'uploadedFilesResponse'
export const PictureFilesResponseCollection = 'pictureFilesResponse'
export const ResultFilesResponseCollection = 'resultFilesResponse'
export const StatusesCollection = 'statuses'
