import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { StatusMeta } from '@rka/doc4s';
import { DateToStrPipe, PagerPanelComponent } from '@rka/ui';
import { NzButtonModule } from 'ng-zorro-antd/button'
import {
  NzTableCellDirective,
  NzTableComponent,
  NzTbodyComponent,
  NzTheadComponent,
  NzThMeasureDirective,
  NzTrDirective,
} from 'ng-zorro-antd/table'
import { map, switchMap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { StatusIconComponent } from '../../../shared/controls/ui/status-icon/status-icon.component'
import { Doc4sListStore } from '../../../shared/store/doc4s.list.store'
import { Doc4sStore } from '../../../shared/store/doc4s/doc4s.store'
import { BackendRoutes } from '../../../shared/types/backend.routes'
import { DocumentForSignatureFields } from '../../../shared/types/doc4s.types'
import { FrontendRoutes } from '../../../shared/types/frontend.routes'
import {
  EditDoc4sPropsDialogComponent,
} from '../doc4s-edit-page/ui/edit-doc4s-props-dialog/edit-doc4s-props-dialog.component'
import { Doc2strPipe } from './pipes/doc2str.pipe'
import { UserIdToStrPipe } from './pipes/user-id-to-str.pipe'
import { Doc4sListFiltersComponent } from './ui/doc4s-list-filters/doc4s-list-filters.component'
import { ResultFilesComponent } from './ui/result-files/result-files.component'
import { NzPopoverDirective } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-sign-page',
  standalone: true,
  templateUrl: './doc4s-list-page.component.html',
  styleUrl: './doc4s-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateToStrPipe,
    Doc2strPipe,
    Doc4sListFiltersComponent,
    EditDoc4sPropsDialogComponent,
    NzButtonModule,
    NzTableCellDirective,
    NzTableComponent,
    NzTbodyComponent,
    NzThMeasureDirective,
    NzTheadComponent,
    NzTrDirective,
    PagerPanelComponent,
    ResultFilesComponent,
    StatusIconComponent,
    UserIdToStrPipe,
    RouterLink,
    NzPopoverDirective,
  ],
})
export class Doc4sListPageComponent
  extends BasePageComponent
  implements OnInit
{
  FrontendRoutes = FrontendRoutes;

  doc4s = inject(Doc4sStore);
  doc4sList = inject(Doc4sListStore);

  onDialogOk(data: DocumentForSignatureFields) {
    this.doc4s.fillNew();
    this.doc4s.readToStateFields(data);
    this.doc4s
      .save()
      .pipe(
        switchMap((id: number) =>
          this.doc4sList.load(
            this.cfg.config.apiAddress + BackendRoutes.doc4sList,
            true
          )
        ),
        map(() =>
          this.router
            .navigateByUrl(FrontendRoutes.doc4sign(this.doc4s.id()))
            .then()
        )
      )
      .subscribe();
  }

  protected readonly StatusMeta = StatusMeta;
  protected readonly BackendRoutes = BackendRoutes;
}
