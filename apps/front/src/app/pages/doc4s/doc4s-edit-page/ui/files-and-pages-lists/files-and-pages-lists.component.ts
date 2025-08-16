import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { patchState } from '@ngrx/signals'
import { addEntities } from '@ngrx/signals/entities'
import { AddJobResponseItem, deepClone, FileUploadOptions, makeJobId, MyUtils } from 'libs/core/core-utils'
import { JobStore } from 'libs/front/core/store/src'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { map, Observable, of, switchMap } from 'rxjs'
import { BaseComponent } from '../../../../../shared/controls/base.component'
import { Doc4sStore } from '../../../../../shared/store/doc4s/doc4s.store'
import { NOTIFICATION_OPTIONS } from '../../../../../shared/types/app.types'
import { BackendRoutes } from '../../../../../shared/types/backend.routes'
import { DOC4S_THUMBNAILS, doc4sFolder, PictureFilesResponseCollection } from '../../../../../shared/types/doc4s.types'
import { PictureFileItemComponent } from './ui/picture-file-item/picture-file-item.component'
import { ResultFileItemComponent } from './ui/result-file-item/result-file-item.component'
import { UploadedFileItemComponent } from './ui/uploaded-file-item/uploaded-file-item.component'

@Component( {
  selector: 'app-files-and-pages-lists',
  standalone: true,
  imports: [
    NzButtonModule,
    UploadedFileItemComponent,
    PictureFileItemComponent,
    NzIconDirective,
    ResultFileItemComponent,
  ],
  templateUrl: './files-and-pages-lists.component.html',
  styleUrl: './files-and-pages-lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class FilesAndPagesListsComponent extends BaseComponent {
  notifications = inject( NzNotificationService )

  expanded = true

  showAllPages = false

  @Input( { required: true } ) source!: FilesAndPagesSource

  get readonly() {
    return this.calcReadOnly()
  }

  doc4s = inject( Doc4sStore )
  jobs = inject( JobStore )

  onFileSelected( $event: any ) {
    const file: File = $event.target?.files[ 0 ]
    const options: FileUploadOptions = {
      destFolder: doc4sFolder( this.doc4s.id() ),
      name: '%random%',
      subfolderPolicy: '',
      returnOriginalImageMetadata: true,
      convertFromPdf: true,
      convertFromPdfOptions: {
        density: 300,
        width: 2480,
        height: 3508,
        preserveAspectRatio: true,
        quality: 0,
        format: 'jpg',
      },
      makeThumbs: true,
      thumbnails: DOC4S_THUMBNAILS,
      convertOfficeFileToPdf: true,
      saveMetaJsonFile: true,
      // uploadToS3: true,
    }
    if ( file ) {
      this.doc4s
        .uploadToJob( this.cfg.config.apiAddress + BackendRoutes.fileUploadToJob, file, options )
        .pipe(
          switchMap( ( res: AddJobResponseItem | undefined ) => {
            if ( res ) {
              const jobId = makeJobId( res.queue, res.jobId )
              this.jobs.addToWatchList( {
                ...res,
                title: 'Обработка файла',
                onComplete: this.onFileUploaded( jobId ),
                onFail: this.onFileUploadFail( jobId ),
                removeFromWatchListAfterComplete: true,
                removeFromWatchListAfterFail: true,
              } )
            }
            return of( undefined )
          } ),
        )
        .subscribe()
    }
  }

  onFileUploaded( id: string ): Observable<number> {
    return of( 1 ).pipe(
      switchMap( () => {
        const data = deepClone( this.jobs.getJobData( id )!.result )
        this.doc4s.addUploadedFile( data, this.source )
        return this.doc4s.save()
      } ),
    )
  }

  onFileUploadFail( id: string ): Observable<void> {
    return of( 1 ).pipe(
      map( () => {
        const data = deepClone( this.jobs.getJobData( id )! )
        console.error( data.failedReason )
        if ( data.failedReason ) {
          this.notifications.error(
            'Ошибка обработки файла',
            data.failedReason,
            NOTIFICATION_OPTIONS,
          )
        }
      } ),
    )
  }

  changeSource() {
    this.doc4s.loadFirstPageIntoImageEditorState( this.source )
  }

  copyPages() {
    const pages = deepClone( this.doc4s.pictureFilesRequestEntities() )
    pages.forEach( ( p ) => {
      p.id = MyUtils.makeRandomId( 8 )
    } )
    patchState(
      this.doc4s,
      addEntities( pages, { collection: PictureFilesResponseCollection } ),
    )
    this.doc4s.setModified()
    this.doc4s.save().subscribe()
  }

  makePdf() {
    this.doc4s
      .makePdfFromPagesJob( this.doc4s.getPictureFilesEntities( this.source )() )
      .subscribe()
  }

  calcReadOnly(): boolean {
    return (
      (!this.doc4s.canEditRequest() && this.source === 'request') ||
      (!this.doc4s.canEditResponse() && this.source === 'response')
    )
  }
}

export type FilesAndPagesSource = 'request' | 'response';
