import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu'
import { FrontendRoutes } from '../../../../types/frontend.routes'
import { BaseComponent } from '../../../base.component'
import { DEFAULT_MAP, MainMenuMap } from './main-menu.types'

@Component( {
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    RouterLink,
    NzMenuDirective,
    NzSubMenuComponent,
    NzMenuItemComponent,
    NzIconModule,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class MainMenuComponent extends BaseComponent implements OnInit {
  FrontendRoutes = FrontendRoutes

  openMap = signal<MainMenuMap>( DEFAULT_MAP )

  override ngOnInit(): void {
    super.ngOnInit()
    // this.app.isMainMenuCollapsed.set(
    //   JSON.parse(localStorage.getItem('isMainMenuCollapsed') ?? 'false'),
    // )
  }

  openHandler( key: string, opened: boolean ) {
  }
}
