import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { patchState } from '@ngrx/signals'
import { PagerStore } from '@rka/store'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzRadioComponent, NzRadioGroupComponent } from 'ng-zorro-antd/radio'

@Component( {
  selector: 'lib-pager-panel',
  standalone: true,
  imports: [
    NzButtonModule,
    NzPaginationModule,
    NzRadioGroupComponent,
    FormsModule,
    NzRadioComponent,
  ],
  templateUrl: './pager-panel.component.html',
  styleUrl: './pager-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class PagerPanelComponent {
  @Input( { required: true } ) store!: PagerStore
  @Input( { required: true } ) loadUrl!: string

  @Input() showNoSortOption = false

  changePage( page: number ) {
    this.store.setPage( page )
    this.store.load( this.loadUrl ).subscribe()
  }

  changeView( $event: string ) {
    patchState( this.store, { view: $event } )
  }

  changeItemsOnPage( $event: any ) {
    this.store.setItemsOnPage( $event )
    this.store.load( this.loadUrl ).subscribe()
  }

  changeOrder( $event: string ) {
    this.store.setSimpleOrder( $event )
    this.store.load( this.loadUrl ).subscribe()
  }
}
