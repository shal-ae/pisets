import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { JobStore } from 'libs/front/core/store/src'
import { NzProgressComponent } from 'ng-zorro-antd/progress'
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton'
import { ProgressPanelJobItemComponent } from './progress-panel-job-item/progress-panel-job-item.component'

@Component( {
  selector: 'app-progress-panel',
  standalone: true,
  imports: [
    ProgressPanelJobItemComponent,
    NzProgressComponent,
  ],
  templateUrl: './progress-panel.component.html',
  styleUrl: './progress-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ProgressPanelComponent {
  public readonly jobs = inject( JobStore )
}
