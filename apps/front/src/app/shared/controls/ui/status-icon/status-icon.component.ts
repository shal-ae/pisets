import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { DocumentStatus, StatusMeta } from 'libs/core/doc4s'
import { NzIconDirective } from 'ng-zorro-antd/icon'

/** Компонент для отображения статуса документа.
 *
 * Иконка или иконка с текстом
 * */
@Component( {
  selector: 'app-status-icon',
  standalone: true,
  imports: [ NzIconDirective ],
  templateUrl: './status-icon.component.html',
  styleUrl: './status-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class StatusIconComponent {
  /** Статус */
  @Input() status?: DocumentStatus

  /** Показывать подсказку иконки (свойство html - title) */
  @Input() showIconTitle = true

  /** Показывать текст статуса */
  @Input() showText = false

  /** Размер иконки, px */
  @Input() iconSizePx = 16

  /** @ignore */
  StatusMeta = StatusMeta
}
