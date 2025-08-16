import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { StatusMeta } from 'libs/core/doc4s'
import { AutoFocusDirective } from 'libs/front/core/ui/src'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input'
import { map, of, switchMap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { LoginResultDTO } from '../../../shared/types/auth.types'
import { FrontendRoutes } from '../../../shared/types/frontend.routes'
import { UserDialogCaptionComponent } from '../ui/user-dialog-caption/user-dialog-caption.component'

@Component( {
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonModule,
    NzInputDirective,
    NzInputGroupComponent,
    RouterLink,
    UserDialogCaptionComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: [ './../user.scss', './login-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class LoginPageComponent extends BasePageComponent implements OnInit {
  readonly FrontendRoutes = FrontendRoutes

  @Input() returnUrl = ''

  @ViewChild( 'code' ) codeElement!: ElementRef
  @ViewChild( 'login' ) loginElement!: ElementRef

  username = ''
  password = ''
  code2fa = ''

  @ViewChild( 'psw' ) pswElement!: ElementRef


  loginResult: LoginResultDTO | null = null
  enter2FaCode = false

  override ngOnInit(): void {
    super.ngOnInit()
    this.username = this.auth.getLastUsername()
    if (this.username) {
      setTimeout( () => this.pswElement.nativeElement.focus() )
    } else {
      setTimeout( () => this.loginElement.nativeElement.focus() )
    }
    this.password = ''
    this.code2fa = ''
    this.enter2FaCode = false
  }

  private afterLogin(): void {
    this.router.navigate( [ this.returnUrl || FrontendRoutes.doc4sList ] ).then()
  }

  private failLogin(): void {
    this.loginResult = null
    this.enter2FaCode = false
    this.code2fa = ''
  }

  submit(): void {
    if ( this.enter2FaCode ) {
      this.auth
        .login2fa( this.username, this.code2fa )
        .pipe(
          map( ( data: LoginResultDTO | undefined ) => {
            if ( data ) {
              this.loginResult = data
              this.afterLogin()
            } else {
              this.failLogin()
            }
          } ),
        )
        .subscribe()
    } else {
      this.auth
        .login( this.username, this.password )
        .pipe(
          switchMap( ( data: LoginResultDTO | undefined ) => {
            if ( !data ) {
              this.failLogin()
              return of( undefined )
            }
            this.loginResult = data
            if ( this.loginResult.user.isTwoFactorAuthenticationEnabled ) {
              if ( this.loginResult.user.useOtpOnly ) {
                return this.auth.login2fa( this.username, this.password ).pipe(
                  map( ( data: LoginResultDTO | undefined ) => {
                    if ( data ) {
                      this.loginResult = data
                      this.afterLogin()
                    } else {
                      this.failLogin()
                    }
                  } ),
                )
              } else {
                this.enter2FaCode = true
                setTimeout( () => this.codeElement.nativeElement.focus() )
              }
            } else {
              this.afterLogin()
            }
            return of( undefined )
          } ),
        )
        .subscribe()
    }
  }

  protected readonly StatusMeta = StatusMeta

  cancel() {
    if ( this.enter2FaCode ) {
      this.failLogin()
    }
    this.router.navigate( [ '/' ] ).then()
  }
}
