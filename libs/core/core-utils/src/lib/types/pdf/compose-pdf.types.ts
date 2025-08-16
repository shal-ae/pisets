import { ImageMetadataSharp, PdfProperties } from '@rka/core-utils'

export interface ComposeDocumentPageRequest {
  folder?: string;
  src: string; // src in Files dir
  stamps: DocumentStamp[]; //
}

export interface ComposeDocumentPageResponse {
  filename: string;
  meta: ImageMetadataSharp;
}

export interface MakePdfFromPicturesRequest {
  pages: ComposeDocumentPageRequest[];
  folder?: string;
  outPdfProperties?: PdfProperties;
}

export interface MakePdfFromPicturesResponse {
  filename: string;
}

export interface ComposeItem {
  input: string | Buffer;
  left: number;
  top: number;
}

export interface DocumentStamp {
  src: string // src in Stamp dir
  position: Rect
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}


export const TestComposePageData29: ComposeDocumentPageRequest = {
  folder: 'private/doc4s/15',
  stamps: [
    {
      position: {
        top: 209.03937447640322,
        left: 115.67997765987154,
        width: 64.5,
        height: 42.6,
      },
      src: 'Image00001.png',
    },
    {
      position: {
        top: 206.22451829098017,
        left: 84.71655962021781,
        width: 49.7,
        height: 13.9,
      },
      src: '6d4faa4b90279a9a1174aa163c4c0c9b.png',
    },
  ],
  src: 'private/doc4s/15/4313cc11a24d233c1e148c69f198f8a4.1.jpg',
}

export const TestComposePageData2: ComposeDocumentPageRequest = {
  folder: '',
  stamps: [
    {
      position: {
        top: 61.91411123514348,
        left: 71.29968807146153,
        width: 7.10062385707693,
        height: 1.9858887648565255,
      },
      src: '6d4faa4b90279a9a1174aa163c4c0c9b.png',
    },
    {
      position: {
        top: 190.32175454724538,
        left: 16.463983189966513,
        width: 49.7,
        height: 13.9,
      },
      src: '6d4faa4b90279a9a1174aa163c4c0c9b.png',
    },
    {
      position: {
        top: 192.52807144264233,
        left: 34.11451835314203,
        width: 44.5,
        height: 42.6,
      },
      src: 'd41258c74fb24f2243525c3aaad33143.png',
    },
  ],
  src: 'private/doc4s/23/a9c122da5b1fa2865b622a817e1adf44.7.jpg',
}

export const TestComposePdfData2: MakePdfFromPicturesRequest = {
  folder: 'private/doc4s/23',
  pages: [ TestComposePageData2 ],
}

// export const TestComposePageData: ComposeDocumentPageRequest = {
//   folder: 'private/doc4s/14',
//   "pageImage": {
//     "src": "private/doc4s/14/67793e6060669afd4eed4cd65be50afe.7.jpg",
//     "dpiX": 300,
//     "dpiY": 300,
//     "width": 2480,
//     "height": 3507,
//     "widthMm": 210,
//     "heightMm": 296.9,
//   },
//   "stamps": [
//     {
//       "id": 1718034297439,
//       "position": {
//         "top": 147.88596070915187,
//         "left": 104.09487302347867,
//         "width": 49.7,
//         "height": 13.899999999999999
//       },
//       "imageDesc": {
//         "src": "6d4faa4b90279a9a1174aa163c4c0c9b.png",
//         "dpiX": 300,
//         "dpiY": 300,
//         "width": 587,
//         "height": 164,
//         "widthMm": 49.7,
//         "heightMm": 13.9
//       }
//     },
//     {
//       "id": 1718034302696,
//       "position": {
//         "top": 238.90273119310012,
//         "left": 54.29324389075228,
//         "width": 49.7,
//         "height": 13.899999999999999
//       },
//       "imageDesc": {
//         "src": "6d4faa4b90279a9a1174aa163c4c0c9b.png",
//         "dpiX": 300,
//         "dpiY": 300,
//         "width": 587,
//         "height": 164,
//         "widthMm": 49.7,
//         "heightMm": 13.9
//       }
//     },
//     {
//       "id": 1718034306080,
//       "position": {
//         "top": 149.60325826545278,
//         "left": 126.84906564446572,
//         "width": 44.5,
//         "height": 42.6
//       },
//       "imageDesc": {
//         "src": "d41258c74fb24f2243525c3aaad33143.png",
//         "dpiX": 300,
//         "dpiY": 300,
//         "width": 525,
//         "height": 503,
//         "widthMm": 44.5,
//         "heightMm": 42.6
//       }
//     }
//   ],
// }
