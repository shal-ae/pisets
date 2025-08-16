import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { FrontendRoutes } from '../types/frontend.routes'

@Injectable( {
  providedIn: 'root',
} )
export class AuthGuard implements CanActivate {
  constructor( private authService: AuthService, private router: Router ) {
  }

  canActivate(): boolean {
    this.authService.readFromLocalStorage()
    if ( this.authService.state().user ) {
      return true
    } else {
      this.router.navigate( [ FrontendRoutes.user.login ] ).then()
      return false
    }
  }
}
