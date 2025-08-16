import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BaseComponent } from '../../../../../../../shared/controls/base.component'
import { DocImagePathPipe } from '../../../../../../../shared/pipes/doc-image-path.pipe'
import { Doc4sStore } from '../../../../../../../shared/store/doc4s/doc4s.store'
import { DocumentPage } from '../../../pages-editor/pages-editor.types'

@Component( {
  selector: 'app-page-list-mini',
  standalone: true,
  imports: [  ],
  templateUrl: './page-list-mini.component.html',
  styleUrl: './page-list-mini.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class PageListMiniComponent extends BaseComponent {
  doc4sStore = inject( Doc4sStore )

  itemClick( p: DocumentPage, $event: MouseEvent ) {
    this.doc4sStore.loadPageIntoImageEditorStore( p.id )
    this.app.windowBrowser?.scrollTo( 0, 0 )
    // document.getElementById( 'image-top' )?.scrollIntoView({behavior: 'auto'} )
  }
}
