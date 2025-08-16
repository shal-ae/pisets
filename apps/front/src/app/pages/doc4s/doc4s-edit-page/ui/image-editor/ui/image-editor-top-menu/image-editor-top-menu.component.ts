import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { patchState } from '@ngrx/signals'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu'
import { NzSegmentedComponent } from 'ng-zorro-antd/segmented'
import { BaseComponent } from '../../../../../../../shared/controls/base.component'
import { ImageEditorStore } from '../../image-editor.store'
import { PageZoom, PageZoomOptions } from '../../image-editor.types'

@Component( {
  selector: 'app-image-editor-top-menu',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzDropDownDirective,
    NzDropdownMenuComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzIconDirective,
    NzSegmentedComponent,
    FormsModule,
  ],
  templateUrl: './image-editor-top-menu.component.html',
  styleUrl: './image-editor-top-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ImageEditorTopMenuComponent extends BaseComponent {
  store = inject( ImageEditorStore )

  options = PageZoomOptions

  @Input( { required: true } ) readonly = false
  @Output() onStampsChanged: EventEmitter<void> = new EventEmitter<void>()

  delete() {
    this.store.deleteStamp( this.store.focusedStampId() )
    this.onStampsChanged.emit()
  }

  clone() {
    this.store.cloneStamp( this.store.focusedStampId()! )
    this.onStampsChanged.emit()
  }

  restoreSize() {
    this.store.restoreSizesOfStamp( this.store.focusedStampId()! )
    this.onStampsChanged.emit()
  }

  deleteAll() {
    this.store.deleteStampAll()
    this.onStampsChanged.emit()
  }

  zoomChange( pageZoom: PageZoom ) {
    patchState( this.store, { pageZoom } )
  }
}
