import { ImageDesc } from './image-desc.types'

export const STAMPS_FOLDER = 'private/stamps/'

export interface Stamp {
  id: number;
  name: string;
  sort: number;
  images: ImageDesc[];
}

export const TEST_STAMPS: Stamp[] = [
  {
    id: 1,
    name: 'Stamp 1',
    sort: 2,
    images: [
      {
        src: `/private/common/d4/12/d41258c74fb24f2243525c3aaad33143.png`,
        dpiX: 300,
        dpiY: 300,
        width: 523,
        height: 503,
        widthMm: 44.38,
        heightMm: 42.58,
      },
    ],
  },
  {
    id: 2,
    name: 'Stamp 2',
    sort: 1,
    images: [
      {
        src: `/private/common/6d/4f/6d4faa4b90279a9a1174aa163c4c0c9b.png`,
        dpiX: 300,
        dpiY: 300,
        width: 587,
        height: 164,
        widthMm: 50,
        heightMm: 17.9,
      },
    ],
  },
  {
    id: 3,
    name: 'Stamp 3',
    sort: 3,
    images: [
      {
        src: `/private/common/6d/4f/6d4faa4b90279a9a1174aa163c4c0c9b.png`,
        dpiX: 300,
        dpiY: 300,
        width: 587,
        height: 164,
        widthMm: 50,
        heightMm: 17.9,
      },
      {
        src: `/private/common/d4/12/d41258c74fb24f2243525c3aaad33143.png`,
        dpiX: 300,
        dpiY: 300,
        width: 523,
        height: 503,
        widthMm: 44.38,
        heightMm: 42.58,
      },
    ],
  },
]
