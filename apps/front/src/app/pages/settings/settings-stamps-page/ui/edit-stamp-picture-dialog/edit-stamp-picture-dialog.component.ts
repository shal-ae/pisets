import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { deepClone } from 'libs/core/core-utils'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input'
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number'
import { NzModalComponent, NzModalContentDirective, NzModalFooterDirective } from 'ng-zorro-antd/modal'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { calculateSizesInMmOfImageDesc, ImageDesc } from '../../../../../shared/types/image-desc.types'
import { Stamp } from '../../../../../shared/types/stamp.types'

@Component( {
  selector: 'app-edit-stamp-picture-dialog',
  standalone: true,
  imports: [
    NzButtonModule,
    NzInputDirective,
    NzInputGroupComponent,
    NzInputNumberComponent,
    NzModalComponent,
    ReactiveFormsModule,
    FormsModule,
    NzModalContentDirective,
    NzModalFooterDirective,
  ],
  templateUrl: './edit-stamp-picture-dialog.component.html',
  styleUrl: './edit-stamp-picture-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class EditStampPictureDialogComponent extends BaseComponent {
  isVisible = false

  @Output() onOK: EventEmitter<Stamp> = new EventEmitter<Stamp>()
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>()

  pictureIndex: number = 0
  picture!: ImageDesc
  data?: Stamp

  open( value: Stamp, pictureIndex: number ) {
    this.data = deepClone( value )
    this.pictureIndex = pictureIndex
    this.picture = this.data.images[ pictureIndex ]
    this.isVisible = true
    this.cdr.markForCheck()
  }

  handleOk() {
    this.isVisible = false
    const images = [ ...this.data!.images ]
    images[ this.pictureIndex ] = this.picture
    this.data!.images = images
    this.onOK.emit( this.data )
  }

  handleCancel() {
    this.isVisible = false
    this.onCancel.emit()
  }

  changeWidth( $event: any ) {
    this.picture.heightMm =
      Math.round(
        (this.picture.widthMm * this.picture.height * 10) / this.picture.width,
      ) / 10
    this.calcDpi()
  }

  changeHeight( $event: any ) {
    this.picture.widthMm =
      Math.round(
        (this.picture.heightMm * this.picture.width * 10) / this.picture.height,
      ) / 10
    this.calcDpi()
  }

  calcDpi() {
    this.picture.dpiX = Math.round(
      (this.picture.width / this.picture.widthMm) * 25.4,
    )
    this.picture.dpiY = Math.round(
      (this.picture.height / this.picture.heightMm) * 25.4,
    )
  }

  set300dpi() {
    this.picture.dpiX = 300
    this.picture.dpiY = 300
    calculateSizesInMmOfImageDesc( this.picture )
  }
}
