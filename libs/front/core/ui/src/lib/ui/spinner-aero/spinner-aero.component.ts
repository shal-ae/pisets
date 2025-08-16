import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

/**  Спинер РПК Аэроплан */
@Component( {
  standalone: true,
  selector: 'lib-spinner-aero',
  templateUrl: './spinner-aero.component.html',
  styleUrls: [ './spinner-aero.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class SpinnerAeroComponent {
  /** Высота спинера, px  */
  @Input() height: number = 48
}
