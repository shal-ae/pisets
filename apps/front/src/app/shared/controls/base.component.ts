import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subject, Subscription } from 'rxjs'
import { AppService } from '../services/app.service'
import { AuthService } from '../services/auth.service'
import { ConfigService } from '../services/config.service'

@Component( {
  selector: 'app-base-component',
  template: ``,
  standalone: true,
} )
export class BaseComponent implements OnInit, OnDestroy {
  protected readonly cdr: ChangeDetectorRef = inject( ChangeDetectorRef )
  protected readonly app: AppService = inject( AppService )
  protected readonly auth: AuthService = inject( AuthService )
  protected readonly router: Router = inject( Router )
  protected readonly cfg = inject( ConfigService )

  subscriptions: Subscription[] = []
  protected destroy$ = new Subject<void>()

  ngOnInit(): void {
    this.subscriptions = []
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.unsubscribeAll()
  }

  addSubscription( subscription: Subscription ): BaseComponent {
    this.subscriptions.push( subscription )
    return this
  }

  protected unsubscribeAll(): void {
    this.subscriptions.forEach( ( el ) => {
      el.unsubscribe()
    } )
    this.subscriptions = []
  }
}
