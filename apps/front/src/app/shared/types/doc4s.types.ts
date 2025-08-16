import { FileUploadResult, ThumbnailItem } from 'libs/core/core-utils'
import { DocumentStatus } from 'libs/core/doc4s'
import { DocumentPage } from '../../pages/doc4s/doc4s-edit-page/ui/pages-editor/pages-editor.types'

export const doc4sFolder = ( docId: number ) => `private/doc4s/${docId}/`

export const DOC4S_THUMBNAILS_GROUP_THUMBNAIL = '200'
export const DOC4S_THUMBNAILS_GROUP_VIEW = 'view'

export const DOC4S_THUMBNAILS_VIEW_SIZE = 1500

export const DOC4S_THUMBNAILS: ThumbnailItem[] = [
  { group: DOC4S_THUMBNAILS_GROUP_THUMBNAIL, width: 200, height: 200 },
  {
    group: DOC4S_THUMBNAILS_GROUP_VIEW,
    width: DOC4S_THUMBNAILS_VIEW_SIZE,
    height: DOC4S_THUMBNAILS_VIEW_SIZE,
  },
]

export type DocumentForSignatureFields = {
  id: number;
  num: number;
  authorId: number | null;
  createdAt: Date;
  updatedAt: Date;
  assignedByUserId: number | null;

  subject: string;
  description: string;

  type: string;
  incomingDocumentNumber: string;
  incomingDocumentDate: Date | null;

  counterparty: string;

  status: DocumentStatus;

  approveComments: string;
};

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

export function testStatuses(): StatusTrackItem[] {
  const yesterday = new Date()
  yesterday.setDate( yesterday.getDate() - 1 )

  return [
    {
      id: '1',
      status: 'pending',
      setAt: yesterday,
      setByUserId: null,
    },
    {
      id: '2',
      status: 'approved',
      setAt: new Date(),
      setByUserId: null,
    },
  ]
}

export const UploadedFilesRequestCollection = 'uploadedFilesRequest'
export const PictureFilesRequestCollection = 'pictureFilesRequest'
export const UploadedFilesResponseCollection = 'uploadedFilesResponse'
export const PictureFilesResponseCollection = 'pictureFilesResponse'
export const ResultFilesResponseCollection = 'resultFilesResponse'
export const StatusesCollection = 'statuses'
