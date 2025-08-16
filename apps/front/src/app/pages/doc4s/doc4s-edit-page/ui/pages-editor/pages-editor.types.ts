import { ImageDesc } from '../../../../../shared/types/image-desc.types'
import { StampItems } from '../image-editor/image-editor.types'

export interface DocumentPage {
  id: string;
  uploadedFileId: string | null;
  uploadedFilePage: number | null;
  pageImage: ImageDesc | null;
  stamps: StampItems;
  caption?: string;
}

export const PageItemCollection = 'pages'

export const TEST_DOCUMENT_PAGES: DocumentPage[] = [
  {
    id: '1',
    uploadedFileId: null,
    uploadedFilePage: null,
    pageImage: {
      src: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.4.jpg`,
      srcThumbnail: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.4.400.jpg`,
      dpiX: 300,
      dpiY: 300,
      width: 2480,
      height: 3508,
      widthMm: 210,
      heightMm: 297,
    },
    stamps: [],
  },
  {
    id: '2',
    uploadedFileId: null,
    uploadedFilePage: null,
    pageImage: {
      src: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.5.jpg`,
      srcThumbnail: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.5.400.jpg`,
      dpiX: 300,
      dpiY: 300,
      width: 2480,
      height: 3508,
      widthMm: 210,
      heightMm: 297,
    },
    stamps: [],
  },
  {
    id: '3',
    uploadedFileId: null,
    uploadedFilePage: null,
    pageImage: {
      src: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.6.jpg`,
      srcThumbnail: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.6.400.jpg`,
      dpiX: 300,
      dpiY: 300,
      width: 2480,
      height: 3508,
      widthMm: 210,
      heightMm: 297,
    },
    stamps: [],
  },
]

export const TEST_DOCUMENT_PAGES_2: DocumentPage[] = [
  {
    id: '1',
    uploadedFileId: null,
    uploadedFilePage: null,
    pageImage: {
      src: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.4.jpg`,
      srcThumbnail: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.4.400.jpg`,
      dpiX: 300,
      dpiY: 300,
      width: 2480,
      height: 3508,
      widthMm: 210,
      heightMm: 297,
    },
    stamps: [],
  },
]
