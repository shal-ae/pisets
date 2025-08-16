import { Component, Input } from '@angular/core'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { AbstractDialog } from '../abstract-dialog'

@Component( {
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: [ './question-dialog.component.scss' ],
  standalone: true,
  imports: [ NzModalModule, NzButtonModule, NzWaveModule ],
} )
export class QuestionDialogComponent extends AbstractDialog<boolean> {
  @Input() title = 'Вопрос'
}
