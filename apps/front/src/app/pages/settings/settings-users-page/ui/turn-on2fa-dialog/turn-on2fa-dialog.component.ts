
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input'
import { NzModalComponent, NzModalContentDirective, NzModalFooterDirective } from 'ng-zorro-antd/modal'
import { map } from 'rxjs'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { Generate2faResultDTO } from '../../../../../shared/types/auth.types'

@Component( {
  selector: 'app-turn-on2fa-dialog',
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NzButtonModule,
    NzModalFooterDirective,
    FormsModule,
    NzInputDirective,
    NzInputGroupComponent
],
  templateUrl: './turn-on2fa-dialog.component.html',
  styleUrl: './turn-on2fa-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class TurnOn2faDialogComponent extends BaseComponent {
  @ViewChild( 'code' ) codeElement!: ElementRef

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>()

  isVisible = false
  password = ''
  generatedData?: Generate2faResultDTO | null = null

  turnOnError = ''

  result = false

  open() {
    this.result = false
    this.turnOnError = ''

    this.auth
      .generate2fa()
      .pipe(
        map( ( data ) => {
          this.generatedData = data
          this.cdr.markForCheck()
          this.isVisible = true
          setTimeout( () => this.codeElement.nativeElement.focus() )
        } ),
      )
      .subscribe()
  }

  handleCancel() {
    this.isVisible = false
    this.onClose.emit( false )
  }

  handleOk() {
    this.auth
      .turn2fa( this.password, true )
      .pipe(
        map( ( res ) => {
          if ( res === false ) {
            this.turnOnError = 'Неверный код'
          }
          if ( res === true ) {
            this.turnOnError = ''
            this.result = true
            this.isVisible = false
            this.cdr.markForCheck()
            this.onClose.emit( true )
          }
          if ( res === undefined ) {
            this.turnOnError = 'Произошла ошибка обращения к серверу'
          }
        } ),
      )
      .subscribe()
  }

  passwordKeyup( $event: KeyboardEvent ) {
    this.turnOnError = ''
  }
}
