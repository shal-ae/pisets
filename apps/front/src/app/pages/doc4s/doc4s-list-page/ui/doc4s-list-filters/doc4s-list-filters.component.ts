import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { patchState } from '@ngrx/signals'
import { fillStatusBooleanData, StatusBooleanData } from '@rka/doc4s';
import { PagerStateFilterItem } from '@rka/store';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox'
import { NzInputModule } from 'ng-zorro-antd/input'
import { Observable } from 'rxjs'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { SelectStatusesComponent } from '../../../../../shared/controls/ui/select-statuses/select-statuses.component'
import { Doc4sListStore } from '../../../../../shared/store/doc4s.list.store'
import { BackendRoutes } from '../../../../../shared/types/backend.routes'

@Component( {
  selector: 'app-doc4s-list-filters',
  standalone: true,
  imports: [
    FormsModule,
    NzInputModule,
    NzCheckboxComponent,
    SelectStatusesComponent,
  ],
  templateUrl: './doc4s-list-filters.component.html',
  styleUrl: './doc4s-list-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class Doc4sListFiltersComponent extends BaseComponent {
  doc4sList = inject( Doc4sListStore )

  searchStr = ''

  showAll = false

  override ngOnInit() {
    super.ngOnInit()
    this.showAll = !this.doc4sList.isAuthorFiltered()
  }

  selectedStatuses: StatusBooleanData = fillStatusBooleanData( true )

  changeSearch() {
    this.makeFilters().subscribe()
  }

  changeCheckedAll( $event: boolean ) {
    this.makeFilters().subscribe()
  }

  makeFilters(): Observable<void> {
    const filters: PagerStateFilterItem[] = [
      { filterId: 'search', active: !!this.searchStr, value: this.searchStr },
      {
        filterId: 'author',
        active: !this.showAll,
        value: this.auth.state.user()?.id,
      },
      { filterId: 'statuses', active: true, value: this.selectedStatuses },
    ]
    patchState( this.doc4sList, { filters } )
    return this.doc4sList.load( this.cfg.config.apiAddress + BackendRoutes.doc4sList, true )
  }

  changeStatusSelection( selected: StatusBooleanData ) {
    this.selectedStatuses = selected
    this.makeFilters().subscribe()
  }

  allStatuses() {
    this.selectedStatuses = fillStatusBooleanData( true )
    this.makeFilters().subscribe()
  }
}
