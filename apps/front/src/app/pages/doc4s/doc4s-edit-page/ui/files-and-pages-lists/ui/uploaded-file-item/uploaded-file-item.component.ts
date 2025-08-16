import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzDropdownButtonDirective, NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu'
import { QuestionDialogComponent } from '../../../../../../../shared/dialog/question-dialog/question-dialog.component'
import { BackendFilePipe } from '../../../../../../../shared/pipes/backend-file.pipe'
import { Doc4sStore } from '../../../../../../../shared/store/doc4s/doc4s.store'
import { UploadedFile } from '../../../../../../../shared/types/doc4s.types'
import { FilesAndPagesSource } from '../../files-and-pages-lists.component'
import { PictureFileCaptionPipe } from '../picture-file-item/picture-file-caption.pipe'
import { UploadedFileCaptionPipe } from './uploaded-file-caption.pipe'

@Component( {
  selector: 'app-uploaded-file-item',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzDropDownDirective,
    NzDropdownButtonDirective,
    NzDropdownMenuComponent,
    NzIconDirective,
    NzMenuDirective,
    NzMenuItemComponent,
    QuestionDialogComponent,
    UploadedFileCaptionPipe,
    BackendFilePipe,
  ],
  templateUrl: './uploaded-file-item.component.html',
  styleUrl: '../picture-file-item/picture-file-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class UploadedFileItemComponent implements OnChanges {
  ngOnChanges( changes: SimpleChanges ): void {
    // console.log(this.data)
  }

  @Input( { required: true } ) data!: UploadedFile
  @Input( { required: true } ) source!: FilesAndPagesSource
  @Input( { required: true } ) readonly = false

  doc4s = inject( Doc4sStore )

  delete( withPages: boolean ) {
    this.doc4s.deleteUploadedFiles( [ this.data.id ], this.source )

    if ( withPages ) {
      const ids = this.doc4s
        .getPictureFilesEntities( this.source )()
        .filter( ( e ) => e.uploadedFileId === this.data.id )
        .map( ( e ) => e.id )

      this.doc4s.deletePictureFiles( ids, this.source )
    }
    this.doc4s.save().subscribe()
  }
}
