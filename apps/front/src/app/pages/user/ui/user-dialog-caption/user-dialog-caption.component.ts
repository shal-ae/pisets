import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { StatusMeta } from 'libs/core/doc4s'
import { NzIconDirective } from 'ng-zorro-antd/icon'

@Component( {
  selector: 'app-user-dialog-caption',
  standalone: true,
  imports: [ NzIconDirective ],
  templateUrl: './user-dialog-caption.component.html',
  styleUrl: './user-dialog-caption.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class UserDialogCaptionComponent {
  @Input( { required: true } ) caption!: string
  protected readonly StatusMeta = StatusMeta
}
