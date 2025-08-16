import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzDropdownButtonDirective, NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu'
import { QuestionDialogComponent } from '../../../../../../../shared/dialog/question-dialog/question-dialog.component'
import { BackendFilePipe } from '../../../../../../../shared/pipes/backend-file.pipe'
import { Doc4sStore } from '../../../../../../../shared/store/doc4s/doc4s.store'
import { ResultFile } from '../../../../../../../shared/types/doc4s.types'
import { UploadedFileCaptionPipe } from '../uploaded-file-item/uploaded-file-caption.pipe'
import { ResultFileCaptionPipe } from './result-file-caption.pipe'

@Component( {
  selector: 'app-result-file-item',
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
    ResultFileCaptionPipe,
    BackendFilePipe,
  ],
  templateUrl: './result-file-item.component.html',
  styleUrl: '../picture-file-item/picture-file-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ResultFileItemComponent {
  @Input( { required: true } ) data!: ResultFile
  @Input( { required: true } ) readonly = false

  doc4s = inject( Doc4sStore )

  delete() {
    this.doc4s.deleteResultFiles( [ this.data.id ] )
    this.doc4s.save().subscribe()
  }

}
