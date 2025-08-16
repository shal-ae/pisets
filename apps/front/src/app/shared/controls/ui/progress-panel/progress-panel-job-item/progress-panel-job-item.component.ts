import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { JobItem } from 'libs/core/core-utils'
import { NzProgressComponent } from 'ng-zorro-antd/progress'
import { JobPercentPipe } from './job-percent.pipe'
import { JobTitlePipe } from './job-title.pipe'

@Component( {
  selector: 'app-progress-panel-job-item',
  standalone: true,
  imports: [ JobTitlePipe, JobPercentPipe, NzProgressComponent ],
  templateUrl: './progress-panel-job-item.component.html',
  styleUrl: './progress-panel-job-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ProgressPanelJobItemComponent {
  @Input( { required: true } ) job!: JobItem
}
