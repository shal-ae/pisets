import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { BackendFilePipe } from '../../../../../shared/pipes/backend-file.pipe'
import { DocumentForSignatureListItem } from '../../../../../shared/types/doc4s.types'
import {
  ResultFileCaptionPipe,
} from '../../../doc4s-edit-page/ui/files-and-pages-lists/ui/result-file-item/result-file-caption.pipe'

@Component( {
  selector: 'app-result-files',
  standalone: true,
  imports: [ NzIconDirective, ResultFileCaptionPipe, BackendFilePipe ],
  templateUrl: './result-files.component.html',
  styleUrl: './result-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ResultFilesComponent {
  @Input( { required: true } ) data!: DocumentForSignatureListItem
}
