import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { deepClone } from 'libs/core/core-utils'
import { DocumentStatuses, StatusMeta } from 'libs/core/doc4s'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input'
import { NzModalContentDirective, NzModalFooterDirective, NzModalModule } from 'ng-zorro-antd/modal'
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { QuestionDialogComponent } from '../../../../../shared/dialog/question-dialog/question-dialog.component'
import { newDocumentForSignatureFields } from '../../../../../shared/types/doc4s.const'
import { DocumentForSignatureFields } from '../../../../../shared/types/doc4s.types'

@Component( {
  selector: 'app-edit-doc4s-props-dialog',
  standalone: true,
  imports: [
    NzButtonModule,
    NzInputModule,
    NzInputGroupComponent,
    NzModalModule,
    ReactiveFormsModule,
    FormsModule,
    NzModalContentDirective,
    NzModalFooterDirective,
  ],
  templateUrl: './edit-doc4s-props-dialog.component.html',
  styleUrl: './edit-doc4s-props-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class EditDoc4sPropsDialogComponent extends BaseComponent {
  requestReadonly = false
  responseReadonly = false

  DocumentStatuses = DocumentStatuses

  StatusMeta = StatusMeta

  isVisible = false

  @Output() onOK: EventEmitter<DocumentForSignatureFields> =
    new EventEmitter<DocumentForSignatureFields>()
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>()

  data!: DocumentForSignatureFields

  open(
    value?: DocumentForSignatureFields,
    requestReadonly?: boolean,
    responseReadonly?: boolean,
  ) {
    this.requestReadonly = !!requestReadonly
    this.responseReadonly = !!responseReadonly

    if ( !this.auth.state.user()?.id ) {
      console.warn( 'No login' )
      return
    }
    if ( value ) {
      this.data = deepClone( value )
      if ( this.data.approveComments === undefined ) {
        this.data.approveComments = ''
      }
    } else {
      this.data = newDocumentForSignatureFields( this.auth.state.user()!.id )
    }
    this.isVisible = true
    this.cdr.markForCheck()
  }

  handleCancel() {
    this.isVisible = false
    this.onCancel.emit()
  }

  handleOk() {
    this.isVisible = false
    this.onOK.emit( this.data )
  }
}
