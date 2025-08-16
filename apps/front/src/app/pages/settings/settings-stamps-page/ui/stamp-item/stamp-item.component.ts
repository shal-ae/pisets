import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { FileUploadOptions } from 'libs/core/core-utils'
import { ImageEventInfo, PictureRolloverComponent } from 'libs/front/core/ui/src'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzDropdownButtonDirective, NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu'
import { of, switchMap } from 'rxjs'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { QuestionDialogComponent } from '../../../../../shared/dialog/question-dialog/question-dialog.component'
import { StampStore } from '../../../../../shared/store/stamp.store'
import { BackendRoutes } from '../../../../../shared/types/backend.routes'
import { ImageDesc, imageDescFromUploadedInfo } from '../../../../../shared/types/image-desc.types'
import { Stamp, STAMPS_FOLDER } from '../../../../../shared/types/stamp.types'
import {
  ImagesToRolloverPicturePipe,
} from '../../../../doc4s/doc4s-edit-page/ui/image-editor/ui/stamp-gallery/images-to-rollover-picture.pipe'
import { EditUserDialogComponent } from '../../../settings-users-page/ui/edit-user-dialog/edit-user-dialog.component'
import { EditStampPictureDialogComponent } from '../edit-stamp-picture-dialog/edit-stamp-picture-dialog.component'

@Component( {
  selector: 'app-stamp-item',
  standalone: true,
  imports: [
    ImagesToRolloverPicturePipe,
    PictureRolloverComponent,
    NzButtonComponent,
    NzIconDirective,
    NzDropdownButtonDirective,
    NzDropDownDirective,
    NzDropdownMenuComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    QuestionDialogComponent,
    EditStampPictureDialogComponent,
  ],
  templateUrl: './stamp-item.component.html',
  styleUrl: './stamp-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class StampItemComponent extends BaseComponent implements OnChanges {
  STAMPS_FOLDER = STAMPS_FOLDER
  stampStore = inject( StampStore )
  @ViewChild( EditStampPictureDialogComponent )
  editStampPictureDialogComponent!: EditStampPictureDialogComponent
  @Input( { required: true } ) stamp!: Stamp

  @Input( { required: true } ) readonly = false

  ngOnChanges( changes: SimpleChanges ): void {
    const cv: Stamp = changes[ 'stamp' ].currentValue
    if ( cv ) {
      if ( cv.images.length ) {
        this.shownImage.set( cv.images[ 0 ] )
        this.shownImageIndex.set( 0 )
      } else {
        this.shownImage.set( null )
        this.shownImageIndex.set( null )
      }
    }
  }

  shownImage = signal<ImageDesc | null>( null )
  shownImageIndex = signal<number | null>( null )

  imageClick( stamp: Stamp, $event: ImageEventInfo ) {
    if ( this.readonly ) {
      return
    }
    this.editStampPictureDialogComponent.open( stamp, $event.index! )
  }

  showStamp( index: number | null ) {
    if ( index !== null ) {
      this.shownImage.set( this.stamp.images[ index ] )
      this.shownImageIndex.set( index )
    }
  }

  onFileSelected( $event: any ) {
    const file: File = $event.target?.files[ 0 ]
    const options: FileUploadOptions = {
      destFolder: STAMPS_FOLDER,
      name: '%md5%',
      subfolderPolicy: '',
      returnOriginalImageMetadata: true,
    }
    if ( file ) {
      this.stampStore
        .upload( this.cfg.config.apiAddress + BackendRoutes.fileUpload, file, options )
        .pipe(
          switchMap( ( res ) => {
            const imageDesc = imageDescFromUploadedInfo( res, STAMPS_FOLDER )
            if ( !res || !imageDesc ) {
              return of( undefined )
            } else {
              return this.stampStore.upsert(
                this.cfg.config.apiAddress + BackendRoutes.stampsUpsert,
                {
                  ...this.stamp,
                  images: [ ...this.stamp.images, imageDesc ],
                },
                true,
              )
            }
          } ),
          switchMap( () => this.stampStore.load( this.cfg.config.apiAddress + BackendRoutes.stampsList ) ),
        )
        .subscribe()
    }
  }

  deleteStamp() {
    this.stampStore
      .deleteItems( this.cfg.config.apiAddress + BackendRoutes.stampsDelete, [ this.stamp.id ] )
      .pipe( switchMap( () => this.stampStore.load( this.cfg.config.apiAddress + BackendRoutes.stampsList, true ) ) )
      .subscribe()
  }

  deletePicture() {
    if ( !this.shownImageIndex() === null || this.stamp.images.length < 2 ) {
      return
    }
    const images: ImageDesc[] = []
    for ( let i = 0; i < this.stamp.images.length; i++ ) {
      if ( i !== this.shownImageIndex() ) {
        images.push( this.stamp.images[ i ] )
      }
    }
    return this.stampStore
      .upsert(
        this.cfg.config.apiAddress + BackendRoutes.stampsUpsert,
        {
          ...this.stamp,
          images,
        },
        true,
      )
      .pipe( switchMap( () => this.stampStore.load( this.cfg.config.apiAddress + BackendRoutes.stampsList ) ) )
      .subscribe()
  }

  onStampEdited( stamp: Stamp ) {
    return this.stampStore
      .upsert( this.cfg.config.apiAddress + BackendRoutes.stampsUpsert, stamp, true )
      .pipe( switchMap( () => this.stampStore.load( this.cfg.config.apiAddress + BackendRoutes.stampsList ) ) )
      .subscribe()
  }
}
