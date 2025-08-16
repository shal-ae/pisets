import { isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core'
import { Titles } from '../types/titles'

@Injectable( {
  providedIn: 'root',
} )
export class AppService {
  _isBrowser = false

  constructor( @Inject( PLATFORM_ID ) platformId: Object ) {
    this._isBrowser = isPlatformBrowser( platformId )
  }

  get isBrowser(): boolean {
    return this._isBrowser
  }

  get windowBrowser() {
    if ( this._isBrowser ) {
      return window
    } else {
      return null
    }
  }

  get locationPathAndSearch(): string {
    if ( this._isBrowser ) {
      return window.location.pathname + window.location.search
    } else {
      return '/'
    }
  }

  title = signal( Titles.home )

  showInstructions = signal( false )
  isMainMenuCollapsed = signal( false )

  switchMainMenuCollapse() {
    this.isMainMenuCollapsed.set( !this.isMainMenuCollapsed() )
  }
}
