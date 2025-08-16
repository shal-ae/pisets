import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { DocumentStatus, DocumentStatuses, StatusBooleanData, StatusMeta } from '@rka/doc4s';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon'

/** Компонент для выбора статуса в виде кнопок. Можно задать недоступные для выбора статусы.  */
@Component( {
  selector: 'app-status-buttons',
  standalone: true,
  imports: [ NzButtonModule, NzIconDirective ],
  templateUrl: './status-buttons.component.html',
  styleUrl: './status-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class StatusButtonsComponent {
  /** @internal */
  StatusMeta = StatusMeta
  /** @internal */
  DocumentStatuses = DocumentStatuses

  /** Статус  */
  @Input() status: DocumentStatus | null = null

  /** При изменении статуса нажатием кнопки  */
  @Output() onStatusChange: EventEmitter<DocumentStatus> =
    new EventEmitter<DocumentStatus>()

  /** Недоступные для нажатия кнпки  */
  @Input() disabledButtons: Partial<StatusBooleanData> = {}

  /** @internal */
  click( s: DocumentStatus ) {
    this.onStatusChange.emit( s )
  }
}
