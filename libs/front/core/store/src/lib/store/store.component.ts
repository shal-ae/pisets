
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component( {
  selector: 'lib-store',
  standalone: true,
  imports: [],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class StoreComponent {
}
