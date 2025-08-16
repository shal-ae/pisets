import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { Doc4sStore } from '../../../../../shared/store/doc4s/doc4s.store'
import { EditDoc4sPropsDialogComponent } from '../edit-doc4s-props-dialog/edit-doc4s-props-dialog.component'
import { ImageEditorComponent } from '../image-editor/image-editor.component'
import { PageListComponent } from './ui/page-list/page-list.component'

@Component( {
  selector: 'app-pages-editor',
  standalone: true,
  imports: [
    PageListComponent,
    ImageEditorComponent,
  ],
  templateUrl: './pages-editor.component.html',
  styleUrl: './pages-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class PagesEditorComponent extends BaseComponent {
  doc4s = inject( Doc4sStore )

  @Output() onDocumentChanged: EventEmitter<void> = new EventEmitter<void>()

  stampsChanged() {
    this.doc4s.updateStampsOfSelectedPageFromEditorStore()
    this.onDocumentChanged.emit()
  }

  get readonly(): boolean {
    return (
      (!this.doc4s.canEditRequest() &&
        this.doc4s.filesAndPagesSource() === 'request') ||
      (!this.doc4s.canEditResponse() &&
        this.doc4s.filesAndPagesSource() === 'response')
    )
  }
}
