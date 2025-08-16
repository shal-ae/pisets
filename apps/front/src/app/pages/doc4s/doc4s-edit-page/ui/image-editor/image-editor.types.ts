import { Rect } from 'libs/front/core/ui/src'
import { ImageDesc } from '../../../../../shared/types/image-desc.types'

export interface ImageEditorData {
  pageImage: ImageDesc;
  stamps: StampItems;
}

export interface StampItem {
  id: number;
  imageDesc: ImageDesc;
  position: Rect;
}

export type StampItems = StampItem[];

export const TEST_IMAGE_EDITOR_DATA: ImageEditorData = {
  pageImage: {
    src: `/private/layout/6c/a1/6ca161406e0e23dc0265ef984a43c39e.6.jpg`,
    dpiX: 300,
    dpiY: 300,
    width: 2480,
    height: 3508,
    widthMm: 210,
    heightMm: 297,
  },
  stamps: [],
}

export type PageZoom = 'width' | 'height';
type PageZoomOption = { value: PageZoom; icon: string };
export const PageZoomOptions: PageZoomOption[] = [
  { value: 'height', icon: 'column-height' }, // label: ''
  { value: 'width', icon: 'column-width' },
]
