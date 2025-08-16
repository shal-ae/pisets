import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { deepClone } from '@rka/core-utils';
import { DocumentStatus, DocumentStatuses, fillStatusBooleanData, StatusBooleanData, StatusMeta } from '@rka/doc4s';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox'
import { NzIconDirective } from 'ng-zorro-antd/icon'

/** Компонент для выбора статусов документов в виде чекбоксов. */
@Component( {
  selector: 'app-select-statuses',
  standalone: true,
  imports: [
    NzButtonModule,
    NzCheckboxComponent,
    FormsModule,
    NzIconDirective,
  ],
  templateUrl: './select-statuses.component.html',
  styleUrl: './select-statuses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class SelectStatusesComponent {
  /** @internal */
  DocumentStatuses = DocumentStatuses

  /** @internal */
  StatusMeta = StatusMeta

  /** Выбранные статусы документов.  */
  @Input() selected: StatusBooleanData = fillStatusBooleanData( false )

  /** При изменении выбранных статусов */
  @Output() changeSelection: EventEmitter<StatusBooleanData> =
    new EventEmitter<StatusBooleanData>()

  /** @internal */
  changeChecked( checked: boolean, status: DocumentStatus ) {
    const res = deepClone( this.selected )
    res[ status ] = checked
    this.changeSelection.emit( res )
  }
}
