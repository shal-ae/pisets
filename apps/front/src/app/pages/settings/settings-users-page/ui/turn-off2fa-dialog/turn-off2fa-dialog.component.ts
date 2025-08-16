import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input'
import { NzModalComponent, NzModalContentDirective, NzModalFooterDirective } from 'ng-zorro-antd/modal'
import { map } from 'rxjs'
import { BaseComponent } from '../../../../../shared/controls/base.component'

@Component( {
  selector: 'app-turn-off2fa-dialog',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonModule,
    NzInputDirective,
    NzInputGroupComponent,
    NzModalComponent,
    NzModalContentDirective,
    NzModalFooterDirective,
  ],
  templateUrl: './turn-off2fa-dialog.component.html',
  styleUrl: './turn-off2fa-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class TurnOff2faDialogComponent extends BaseComponent {
  @ViewChild( 'code' ) codeElement!: ElementRef

  isVisible = false
  password = ''

  error = ''
  result = false
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>()

  open() {
    this.result = false
    this.error = ''
    this.isVisible = true
    this.cdr.markForCheck()
    setTimeout( () => this.codeElement.nativeElement.focus() )
  }

  handleCancel() {
    this.isVisible = false
    this.onClose.emit( false )
  }

  handleOk() {
    this.auth
      .turn2fa( this.password, false )
      .pipe(
        map( ( res ) => {
          if ( res === false ) {
            this.error = 'Неверный код'
          }
          if ( res === true ) {
            this.error = ''
            this.result = true
            this.isVisible = false
            this.cdr.markForCheck()
            this.onClose.emit( true )
          }
          if ( res === undefined ) {
            this.error = 'Произошла ошибка обращения к серверу'
          }
        } ),
      )
      .subscribe()
  }

  passwordKeyup( $event: KeyboardEvent ) {
    this.error = ''
  }
}
