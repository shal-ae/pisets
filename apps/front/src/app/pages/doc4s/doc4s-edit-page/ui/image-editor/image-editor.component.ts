import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { patchState } from '@ngrx/signals'
import { NzAffixComponent } from 'ng-zorro-antd/affix'
import { NgxResizeObserverModule } from 'ngx-resize-observer'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { DocImagePathPipe } from '../../../../../shared/pipes/doc-image-path.pipe'
import { StampImagePathPipe } from '../../../../../shared/pipes/stamp-image-path.pipe'
import { ImageDesc } from '../../../../../shared/types/image-desc.types'
import { ImageEditorStore } from './image-editor.store'
import { StampItem } from './image-editor.types'
import { PositionMmToPxPipe } from './position-mm-to-px.pipe'
import { ImageEditorTopMenuComponent } from './ui/image-editor-top-menu/image-editor-top-menu.component'
import { PageListMiniComponent } from './ui/page-list-mini/page-list-mini.component'
import { StampGalleryComponent } from './ui/stamp-gallery/stamp-gallery.component'
import { RectChangeEvent, ResizerComponent } from '@rka/ui';

@Component( {
  selector: 'app-image-editor',
  standalone: true,
  imports: [
    NgxResizeObserverModule,
    ResizerComponent,
    PositionMmToPxPipe,
    StampGalleryComponent,
    ImageEditorTopMenuComponent,
    StampImagePathPipe,
    DocImagePathPipe,
    NzAffixComponent,
    PageListMiniComponent,
  ],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ImageEditorComponent extends BaseComponent {
  store = inject( ImageEditorStore )

  @Input( { required: true } ) readonly = false
  @Output() onStampsChanged: EventEmitter<void> = new EventEmitter<void>()

  handleResize( $event: ResizeObserverEntry ) {
    patchState( this.store, { documentImageRect: $event.contentRect } )
  }

  stampDragged( stampId: number | string, positionChangeEvent: RectChangeEvent ) {
    this.store.changeStampWhenDragged( stampId, positionChangeEvent )
    this.onStampsChanged.emit()
  }

  onGalleryClick( imageDesc: ImageDesc ) {
    if ( this.readonly ) {
      return
    }
    this.store.addStamp( imageDesc )
    this.onStampsChanged.emit()
  }

  clickOnStamp( stamp: StampItem, $event: MouseEvent ) {
    this.store.changeFocused( stamp.id )
    $event.stopPropagation()
  }

  onPictureClick() {
    this.store.changeFocused( null )
  }

  kd( $event: KeyboardEvent ) {
    console.log( $event )
  }

  topMenuStampsChanged() {
    this.onStampsChanged.emit()
  }
}
