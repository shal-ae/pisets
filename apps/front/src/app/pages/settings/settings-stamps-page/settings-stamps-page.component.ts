import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { FileUploadOptions } from '@rka/core-utils';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { of, switchMap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { StampStore } from '../../../shared/store/stamp.store'
import { BackendRoutes } from '../../../shared/types/backend.routes'
import { imageDescFromUploadedInfo } from '../../../shared/types/image-desc.types'
import { STAMPS_FOLDER } from '../../../shared/types/stamp.types'
import { StampItemComponent } from './ui/stamp-item/stamp-item.component'
import { PagerPanelComponent } from '@rka/ui';

@Component( {
  selector: 'app-settings-stamps-page',
  standalone: true,
  imports: [
    NzButtonModule,
    StampItemComponent,
    PagerPanelComponent,
  ],
  templateUrl: './settings-stamps-page.component.html',
  styleUrl: './settings-stamps-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class SettingsStampsPageComponent
  extends BasePageComponent
  implements OnInit {
  readonly = false

  stamp = inject( StampStore )

  override ngOnInit() {
    super.ngOnInit()
    this.readonly = !this.auth.canEditStamps()
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
      this.stamp
        .upload( this.cfg.config.apiAddress + BackendRoutes.fileUpload, file, options )
        .pipe(
          switchMap( ( res ) => {
            const imageDesc = imageDescFromUploadedInfo( res, STAMPS_FOLDER )
            if ( !res || !imageDesc ) {
              return of( undefined )
            } else {
              return this.stamp.upsert(
                this.cfg.config.apiAddress + BackendRoutes.stampsUpsert,
                {
                  id: 0,
                  name: res.originalName,
                  sort: 0,
                  images: [ imageDesc ],
                },
                true,
              )
            }
          } ),
          switchMap( () => this.stamp.load( this.cfg.config.apiAddress + BackendRoutes.stampsList ) ),
        )
        .subscribe()
    }
  }

  protected readonly BackendRoutes = BackendRoutes
}
