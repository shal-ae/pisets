import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzDropdownButtonDirective, NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu'
import { QuestionDialogComponent } from '../../../../../../../shared/dialog/question-dialog/question-dialog.component'
import { Doc4sStore } from '../../../../../../../shared/store/doc4s/doc4s.store'
import { DocumentPage } from '../../../pages-editor/pages-editor.types'
import { FilesAndPagesSource } from '../../files-and-pages-lists.component'
import { PictureFileCaptionPipe } from './picture-file-caption.pipe'

@Component( {
  selector: 'app-picture-file-item',
  standalone: true,
  imports: [
    PictureFileCaptionPipe,
    NzButtonComponent,
    NzDropDownDirective,
    NzDropdownButtonDirective,
    NzDropdownMenuComponent,
    NzIconDirective,
    NzMenuDirective,
    NzMenuItemComponent,
    QuestionDialogComponent,
  ],
  templateUrl: './picture-file-item.component.html',
  styleUrl: './picture-file-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class PictureFileItemComponent {
  @Input( { required: true } ) data!: DocumentPage
  @Input( { required: true } ) source!: FilesAndPagesSource
  @Input( { required: true } ) readonly = false

  doc4s = inject( Doc4sStore )

  clickPicture( id: string ) {
    this.doc4s.loadPageIntoImageEditorStore( id, this.source )
  }

  delete() {
    this.doc4s.deletePictureFiles( [ this.data.id ], this.source )
    this.doc4s.save().subscribe()
  }
}
