import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { StatusMeta } from '@rka/doc4s';
import { DateToStrPipe } from '@rka/ui';
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { Doc4sStore } from '../../../../../shared/store/doc4s/doc4s.store'

@Component( {
  selector: 'app-status-list',
  standalone: true,
  imports: [ DateToStrPipe ],
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class StatusListComponent extends BaseComponent {
  doc4s = inject( Doc4sStore )
  StatusMeta = StatusMeta
}
