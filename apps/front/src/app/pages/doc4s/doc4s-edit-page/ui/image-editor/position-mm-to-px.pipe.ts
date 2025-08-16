import { Pipe, PipeTransform } from '@angular/core'
import { Rect } from 'libs/front/core/ui/src'
import { ImageDesc } from '../../../../../shared/types/image-desc.types'
import { StampItem } from './image-editor.types'

@Pipe( {
  name: 'positionMmToPx',
  standalone: true,
  pure: true,
} )
export class PositionMmToPxPipe implements PipeTransform {
  transform(
    stampItem: StampItem,
    pageImageDesc: ImageDesc,
    pageImageRect: DOMRectReadOnly,
  ): Rect {
    const pixelPerMm = pageImageRect.width / pageImageDesc.widthMm
    return {
      width: stampItem.position.width * pixelPerMm, //  imageDesc.widthMm * pixelPerMm,
      height: stampItem.position.height * pixelPerMm, // stampItem.imageDesc.heightMm * pixelPerMm,
      left: stampItem.position.left * pixelPerMm,
      top: stampItem.position.top * pixelPerMm,
    }
  }
}
