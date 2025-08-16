import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core'
import { BaseComponent } from '../../../../../../../shared/controls/base.component'
import { DocImagePathPipe } from '../../../../../../../shared/pipes/doc-image-path.pipe'
import { Doc4sStore } from '../../../../../../../shared/store/doc4s/doc4s.store'
import { DocumentPage } from '../../pages-editor.types'

// @ts-ignore
@Component( {
  selector: 'app-page-list',
  standalone: true,
  imports: [ DocImagePathPipe ],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class PageListComponent extends BaseComponent implements OnChanges {
  ngOnChanges( changes: SimpleChanges ): void {
    const w = changes[ 'width' ]?.currentValue
    if ( w ) {
      // this.width = w
    }
  }

  doc4sStore = inject( Doc4sStore )

  @Input() widthPx = 150

  itemClick( p: DocumentPage, $event: MouseEvent ) {
    this.doc4sStore.loadPageIntoImageEditorStore( p.id )
  }
}
