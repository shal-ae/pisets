import { CdkDrag } from '@angular/cdk/drag-drop'
import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core'
import { ImageEventInfo, PictureRolloverComponent } from 'libs/front/core/ui/src'
import { BaseComponent } from '../../../../../../../shared/controls/base.component'
import { StampStore } from '../../../../../../../shared/store/stamp.store'
import { ImageDesc } from '../../../../../../../shared/types/image-desc.types'
import { Stamp, STAMPS_FOLDER } from '../../../../../../../shared/types/stamp.types'
import { ImagesToRolloverPicturePipe } from './images-to-rollover-picture.pipe'

@Component( {
  selector: 'app-stamp-gallery',
  standalone: true,
  imports: [ PictureRolloverComponent, ImagesToRolloverPicturePipe ],
  templateUrl: './stamp-gallery.component.html',
  styleUrl: './stamp-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class StampGalleryComponent extends BaseComponent implements OnInit {
  stamp = inject( StampStore )
  STAMPS_FOLDER = STAMPS_FOLDER

  @Output() onImageClick = new EventEmitter<ImageDesc>()

  imageClick( st: Stamp, $event: ImageEventInfo ) {
    if ( $event.picture ) {
      const imageDesc = st.images[ $event.index! ]
      this.onImageClick.emit( imageDesc )
    }
  }
}
