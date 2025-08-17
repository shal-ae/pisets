import { HttpClient } from '@angular/common/http'
import { computed, inject, Signal } from '@angular/core'
import { Router } from '@angular/router'
import {
  getState,
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  removeAllEntities,
  setAllEntities,
  setEntity,
  withEntities
} from '@ngrx/signals/entities';
import { AddJobResponseItem, ApiResult, deepClone, FileUploadResult, makeJobId, MakePdfFromPicturesRequest, MakePdfFromPicturesResponse, MyUtils, PdfProperties, StrUtils } from '@rka/core-utils';
import { DocumentStatus, fillStatusBooleanData } from '@rka/doc4s';
import { JobStore, PagerListQueryParams, PagerListServiceResponse, setError, setLoaded, setLoading, setModified, setNotFoundFalse, setNotFoundTrue, setNotModified, withLoadStatus, withModifiedStatus, withNotFoundStatus, withUploadFile } from '@rka/store';
import { map, Observable, of, switchMap, tap } from 'rxjs'
import { catchError } from 'rxjs/operators'
import {
  FilesAndPagesSource,
} from '../../../pages/doc4s/doc4s-edit-page/ui/files-and-pages-lists/files-and-pages-lists.component'
import { ImageEditorStore } from '../../../pages/doc4s/doc4s-edit-page/ui/image-editor/image-editor.store'
import {
  DocumentPage,
  TEST_DOCUMENT_PAGES,
  TEST_DOCUMENT_PAGES_2,
} from '../../../pages/doc4s/doc4s-edit-page/ui/pages-editor/pages-editor.types'
import { docFields2str } from '../../../pages/doc4s/doc4s-list-page/pipes/doc2str.pipe'
import { AuthService } from '../../services/auth.service'
import { ConfigService } from '../../services/config.service'
import { BackendRoutes } from '../../types/backend.routes'
import {
  newDocumentForSignatureFields,
  testDocumentForSignatureFields,
  TestUploadedFile,
} from '../../types/doc4s.const'
import {
  DOC4S_THUMBNAILS_GROUP_THUMBNAIL,
  DOC4S_THUMBNAILS_GROUP_VIEW,
  doc4sFolder, doc4sInitialState, Doc4sState,
  DocumentForSignature,
  DocumentForSignatureFields,
  PictureFilesRequestCollection,
  PictureFilesResponseCollection,
  ResultFile,
  ResultFilesResponseCollection,
  StatusesCollection,
  StatusTrackItem,
  testStatuses,
  UploadedFile,
  UploadedFilesRequestCollection,
  UploadedFilesResponseCollection
} from '../../types/doc4s.types';
import { calculateSizesInMmOfImageDesc, ImageDesc, imageDescFromUploadedInfo } from '../../types/image-desc.types'
import { withDoc4sAdd } from './doc4s-add.feature'
import { withDoc4sTables } from './doc4s-tables.feature'

export const Doc4sStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState<Doc4sState>( doc4sInitialState() ),
  withDoc4sTables(), // в signalStore(...) не входит больше 10 параметров
  withModifiedStatus(),
  withDoc4sAdd(), // в signalStore(...) не входит больше 10 параметров

  withNotFoundStatus(),
  withLoadStatus(),
  withUploadFile(),
  withMethods(
    (
      store,
      http = inject( HttpClient ),
      auth = inject( AuthService ),
      imageEditorStore = inject( ImageEditorStore ),
      router = inject( Router ),
      jobs = inject( JobStore ),
      cfg = inject( ConfigService ),
    ) => ({
      getPictureFilesEntities(
        filesAndPagesSource: FilesAndPagesSource,
      ): Signal<DocumentPage[]> {
        if ( filesAndPagesSource === 'response' ) {
          return store.pictureFilesResponseEntities
        } else {
          return store.pictureFilesRequestEntities
        }
      },

      getUploadedFilesEntities(
        filesAndPagesSource: FilesAndPagesSource,
      ): Signal<UploadedFile[]> {
        if ( filesAndPagesSource === 'response' ) {
          return store.uploadedFilesResponseEntities
        } else {
          return store.uploadedFilesRequestEntities
        }
      },

      fillNew(): void {
        const newStatusItem: StatusTrackItem = {
          id: MyUtils.makeRandomId( 8 ),
          status: 'draft',
          setByUserId: auth.state.user()?.id || null,
          setAt: new Date(),
        }

        patchState(
          store,
          newDocumentForSignatureFields( auth.state.user()?.id ?? null ),
          setNotFoundFalse(),
          setNotModified(),

          setAllEntities( [ { ...newStatusItem } ], {
            collection: StatusesCollection,
          } ),

          removeAllEntities( { collection: UploadedFilesRequestCollection } ),
          removeAllEntities( { collection: PictureFilesRequestCollection } ),
          removeAllEntities( { collection: UploadedFilesResponseCollection } ),
          removeAllEntities( { collection: PictureFilesResponseCollection } ),
          removeAllEntities( { collection: ResultFilesResponseCollection } ),
        )
        this.calcAccess()
      },

      stateFieldsToObject(): DocumentForSignatureFields {
        const s = getState( store )
        return {
          id: s.id,
          num: s.num ?? 0,
          authorId: s.authorId,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          assignedByUserId: s.assignedByUserId,
          subject: s.subject,
          description: s.description,
          type: s.type,
          incomingDocumentNumber: s.incomingDocumentNumber,
          incomingDocumentDate: s.incomingDocumentDate,
          counterparty: s.counterparty,
          status: s.status,
          approveComments: s.approveComments,
        }
      },

      stateToObject(): DocumentForSignature {
        const s = getState( store )
        return {
          ...this.stateFieldsToObject(),
          [ UploadedFilesRequestCollection ]: s[
            `${UploadedFilesRequestCollection}Ids`
            ].map( ( e ) => s[ `${UploadedFilesRequestCollection}EntityMap` ][ e ] ),
          [ PictureFilesRequestCollection ]: s[
            `${PictureFilesRequestCollection}Ids`
            ].map( ( e ) => s[ `${PictureFilesRequestCollection}EntityMap` ][ e ] ),
          [ UploadedFilesResponseCollection ]: s[
            `${UploadedFilesResponseCollection}Ids`
            ].map( ( e ) => s[ `${UploadedFilesResponseCollection}EntityMap` ][ e ] ),
          [ PictureFilesResponseCollection ]: s[
            `${PictureFilesResponseCollection}Ids`
            ].map( ( e ) => s[ `${PictureFilesResponseCollection}EntityMap` ][ e ] ),
          [ ResultFilesResponseCollection ]: s[
            `${ResultFilesResponseCollection}Ids`
            ].map( ( e ) => s[ `${ResultFilesResponseCollection}EntityMap` ][ e ] ),
          [ StatusesCollection ]: s[ `${StatusesCollection}Ids` ].map(
            ( e ) => s[ `${StatusesCollection}EntityMap` ][ e ],
          ),
        }
      },

      save(): Observable<number> {
        patchState( store, setLoading() )
        const obj = this.stateToObject()
        return http
          .post<ApiResult<DocumentForSignature>>( cfg.config.apiAddress + BackendRoutes.doc4sUpsert, obj )
          .pipe(
            catchError( ( err ) => {
              patchState( store, setError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map( ( res: ApiResult<DocumentForSignature> | undefined ) => {
              patchState( store, setLoaded() )
              if ( res === undefined ) {
                return 0
              } else {
                this.readToState( res.payload )
                patchState( store, setNotModified() )
                return res.payload.id
              }
            } ),
            tap( () => this.calcAccess() ),
          )
      },

      setStatus( status: DocumentStatus ): void {
        if ( status === store.status() ) {
          return
        }
        const newStatusItem: StatusTrackItem = {
          id: MyUtils.makeRandomId( 8 ),
          status,
          setByUserId: auth.state.user()?.id ?? null,
          setAt: new Date(),
        }
        patchState(
          store,
          addEntity( newStatusItem, { collection: StatusesCollection } ),
          { status },
        )
        this.setModified()
      },

      readToStateFields( data: DocumentForSignatureFields ) {
        if ( data.status !== store.status() ) {
          const newStatusItem: StatusTrackItem = {
            id: MyUtils.makeRandomId( 8 ),
            status: data.status,
            setByUserId: auth.state.user()?.id ?? null,
            setAt: new Date(),
          }
          patchState(
            store,
            addEntity( newStatusItem, { collection: StatusesCollection } ),
          )
        }
        patchState( store, data )
      },

      readToState( data: DocumentForSignature ) {
        patchState(
          store,
          data,
          setAllEntities( data[ UploadedFilesRequestCollection ] ?? [], {
            collection: UploadedFilesRequestCollection,
          } ),
          setAllEntities( data[ PictureFilesRequestCollection ] ?? [], {
            collection: PictureFilesRequestCollection,
          } ),
          setAllEntities( data[ UploadedFilesResponseCollection ] ?? [], {
            collection: UploadedFilesResponseCollection,
          } ),
          setAllEntities( data[ PictureFilesResponseCollection ] ?? [], {
            collection: PictureFilesResponseCollection,
          } ),
          setAllEntities( data[ ResultFilesResponseCollection ] ?? [], {
            collection: ResultFilesResponseCollection,
          } ),
          setAllEntities( data[ StatusesCollection ] ?? [], {
            collection: StatusesCollection,
          } ),
        )
      },

      load( id: number ): Observable<void> {
        const params: PagerListQueryParams = {
          whereClause: `where id = ${id}`,
          countTotal: true,
        }
        patchState( store, setLoading(), setNotFoundFalse() )
        return http
          .post<ApiResult<PagerListServiceResponse<DocumentForSignature>>>(
            cfg.config.apiAddress + BackendRoutes.doc4sGet,
            params,
          )
          .pipe(
            catchError( ( err ) => {
              patchState( store, setError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map(
              (
                res:
                  | ApiResult<PagerListServiceResponse<DocumentForSignature>>
                  | undefined,
              ) => res?.payload,
            ),
            map(
              (
                res: PagerListServiceResponse<DocumentForSignature> | undefined,
              ) => {
                if ( res === undefined ) {
                  return undefined // load error
                }
                if ( res.data[ 0 ] ) {
                  return res.data[ 0 ]
                } else {
                  patchState( store, setNotFoundTrue() )
                  auth.logout().subscribe()
                  return undefined
                }
              },
            ),
            map( ( data: DocumentForSignature | undefined ) => {
              if ( data ) {
                if ( !data.num ) {
                  data.num = data.id
                }
                this.readToState( data )
                patchState( store, setNotFoundFalse() )
              } else {
                this.fillNew()
              }
              patchState( store, setNotModified(), setLoaded() )
              this.calcAccess()
            } ),
          )
      },

      loadTestData() {
        patchState( store, testDocumentForSignatureFields(), setNotFoundFalse() )
        patchState(
          store,
          setAllEntities( testStatuses(), { collection: StatusesCollection } ),
        )
        patchState(
          store,
          setAllEntities( TestUploadedFile, {
            collection: UploadedFilesRequestCollection,
          } ),
        )
        patchState(
          store,
          setAllEntities( TEST_DOCUMENT_PAGES, {
            collection: PictureFilesRequestCollection,
          } ),
        )
        patchState(
          store,
          removeAllEntities( { collection: UploadedFilesResponseCollection } ),
        )
        patchState(
          store,
          setAllEntities( TEST_DOCUMENT_PAGES_2, {
            collection: PictureFilesResponseCollection,
          } ),
        )
        patchState(
          store,
          removeAllEntities( { collection: ResultFilesResponseCollection } ),
        )
        this.calcAccess()
      },

      loadPageIntoImageEditorStore(
        pageId: string | null,
        setSource?: FilesAndPagesSource,
      ): void {
        if ( setSource ) {
          patchState( store, { filesAndPagesSource: setSource } )
        }
        if (
          pageId &&
          store.filesAndPagesSource() === 'request' &&
          store.pictureFilesRequestEntityMap()[ pageId ]
        ) {
          imageEditorStore.loadData(
            store.pictureFilesRequestEntityMap()[ pageId ],
          )
          patchState( store, { selectedPageId: pageId } )
        } else if (
          pageId &&
          store.filesAndPagesSource() === 'response' &&
          store.pictureFilesResponseEntityMap()[ pageId ]
        ) {
          imageEditorStore.loadData(
            store.pictureFilesResponseEntityMap()[ pageId ],
          )
          patchState( store, { selectedPageId: pageId } )
        } else {
          imageEditorStore.reset()
          patchState( store, { selectedPageId: null } )
        }
      },

      loadFirstPageIntoImageEditorState( setSource?: FilesAndPagesSource ): void {
        if ( setSource ) {
          patchState( store, { filesAndPagesSource: setSource } )
        }
        if ( store.filesAndPagesSource() === 'request' ) {
          const pageId = store.pictureFilesRequestEntities()[ 0 ]?.id ?? null
          if ( pageId === null ) {
            imageEditorStore.reset()
          } else {
            imageEditorStore.loadData(
              store.pictureFilesRequestEntityMap()[ pageId ],
            )
          }
          patchState( store, { selectedPageId: pageId } )
        } else if ( store.filesAndPagesSource() === 'response' ) {
          const pageId = store.pictureFilesResponseEntities()[ 0 ]?.id ?? null
          if ( pageId === null ) {
            imageEditorStore.reset()
          } else {
            imageEditorStore.loadData(
              store.pictureFilesResponseEntityMap()[ pageId ],
            )
          }
          patchState( store, { selectedPageId: pageId } )
        } else {
          imageEditorStore.reset()
          patchState( store, { selectedPageId: null } )
        }
      },

      updateStampsOfSelectedPageFromEditorStore(): void {
        if ( store.selectedPageId() === null || !store.filesAndPagesSource() ) {
          return
        }
        const pageId = store.selectedPageId()!

        if ( store.filesAndPagesSource() === 'request' ) {
          const page = deepClone( store.pictureFilesRequestEntityMap()[ pageId ] )
          page.stamps = deepClone( imageEditorStore.stampsEntities() )
          patchState(
            store,
            setEntity( page, { collection: PictureFilesRequestCollection } ),
          )
        }
        if ( store.filesAndPagesSource() === 'response' ) {
          const page = deepClone( store.pictureFilesResponseEntityMap()[ pageId ] )
          page.stamps = deepClone( imageEditorStore.stampsEntities() )
          patchState(
            store,
            setEntity( page, { collection: PictureFilesResponseCollection } ),
          )
        }
      },

      addUploadedFile( file: FileUploadResult, to: FilesAndPagesSource ): void {
        if ( file.originalImageMetadata ) {
          // const imageDesc = imageDescFromUploadedInfo(file, doc4sFolder(store.id()))!
          const imageDesc = imageDescFromUploadedInfo( file )!
          // imageDesc.src = '/' + imageDesc.src
          if (
            file.thumbs.ok &&
            file.thumbs.groups?.length &&
            file.thumbs.ext?.length
          ) {
            const fn = MyUtils.addFilenameWithoutExt( imageDesc.src )
            imageDesc.srcThumbnail = `${fn}.${file.thumbs.groups[ 0 ]}.${file.thumbs.ext[ 0 ]}`
            if ( file.thumbs.groups[ 1 ] ) {
              imageDesc.srcView = `${fn}.${file.thumbs.groups[ 1 ]}.${file.thumbs.ext[ 0 ]}`
            }
          }

          const newPage: DocumentPage = {
            id: MyUtils.makeRandomId( 8 ),
            uploadedFileId: null,
            uploadedFilePage: null,
            pageImage: imageDesc,
            stamps: [],
            caption: file.originalName,
          }

          if ( to === 'request' ) {
            patchState(
              store,
              addEntity( newPage, { collection: PictureFilesRequestCollection } ),
            )
            this.loadPageIntoImageEditorStore( newPage.id, 'request' )
          } else if ( to === 'response' ) {
            patchState(
              store,
              addEntity( newPage, { collection: PictureFilesResponseCollection } ),
            )
            this.loadPageIntoImageEditorStore( newPage.id, 'response' )
          }
          this.setModified()
        } else {
          const newFiles: UploadedFile[] = [
            {
              ...file,
              id: MyUtils.makeRandomId( 8 ),
              uploadedAt: new Date(),
              uploadedByUserId: auth.state.user()?.id ?? null,
            },
          ]

          if ( file.renderedToPdf ) {
            const pdf: UploadedFile = {
              ...file,
              id: MyUtils.makeRandomId( 8 ),
              uploadedAt: new Date(),
              uploadedByUserId: auth.state.user()?.id ?? null,
            }

            pdf.filePath =
              StrUtils.stringBeforeLastString( pdf.filePath, '.' ) + '.pdf'
            pdf.originalName =
              StrUtils.stringBeforeLastString( pdf.originalName, '.' ) + '.pdf'
            newFiles.push( pdf )
          }

          if ( to === 'request' ) {
            patchState(
              store,
              addEntities( newFiles, {
                collection: UploadedFilesRequestCollection,
              } ),
            )
          } else if ( to === 'response' ) {
            patchState(
              store,
              addEntities( newFiles, {
                collection: UploadedFilesResponseCollection,
              } ),
            )
          }

          if ( file.pageCount ) {
            const newPages: DocumentPage[] = []
            for ( let p = 1; p <= file.pageCount; p++ ) {
              const filePath =
                StrUtils.stringBeforeLastString( file.filePath, '/' ) + '/'

              const fn = StrUtils.lastPartAfter( file.filePath, '/' )
              const fnNoExt = StrUtils.stringBeforeLastString( fn, '.' )
              const pageFilename = `${fnNoExt}.${p}.jpg`
              const pageThumbFilename = `${fnNoExt}.${p}.${DOC4S_THUMBNAILS_GROUP_THUMBNAIL}.jpg`
              const pageViewFilename = `${fnNoExt}.${p}.${DOC4S_THUMBNAILS_GROUP_VIEW}.jpg`

              const pageImage: ImageDesc = {
                src: filePath + pageFilename,
                srcThumbnail: filePath + pageThumbFilename,
                srcView: filePath + pageViewFilename,
                width: file.requestOptions.convertFromPdfOptions!.width || 0,
                height: file.requestOptions.convertFromPdfOptions!.height || 0,
                dpiX: file.requestOptions.convertFromPdfOptions!.density || 300,
                dpiY: file.requestOptions.convertFromPdfOptions!.density || 300,
                widthMm: 0,
                heightMm: 0,
              }
              calculateSizesInMmOfImageDesc( pageImage )

              const newPage: DocumentPage = {
                id: MyUtils.makeRandomId( 8 ),
                uploadedFileId: newFiles[ 0 ].id,
                uploadedFilePage: p,
                pageImage,
                stamps: [],
                caption: StrUtils.setFileExtFromAnotherFile(
                  file.originalName,
                  pageFilename,
                  ` - ${p}`,
                ),
              }
              newPages.push( newPage )
            }

            const lastPageId = newPages[ newPages.length - 1 ].id
            if ( to === 'request' ) {
              patchState(
                store,
                addEntities( newPages, {
                  collection: PictureFilesRequestCollection,
                } ),
              )
              this.loadPageIntoImageEditorStore( lastPageId, 'request' )
            } else if ( to === 'response' ) {
              patchState(
                store,
                addEntities( newPages, {
                  collection: PictureFilesResponseCollection,
                } ),
              )
              this.loadPageIntoImageEditorStore( lastPageId, 'response' )
            }
          }
          this.setModified()
        }
      },

      deletePictureFiles( ids: string[], source: FilesAndPagesSource ): void {
        if ( source === 'request' ) {
          const m = store
            .pictureFilesRequestEntities()
            .filter( ( e ) => !ids.includes( e.id ) )
          patchState(
            store,
            setAllEntities( m, { collection: PictureFilesRequestCollection } ),
          )
          this.setModified()
        }
        if ( source === 'response' ) {
          const m = store
            .pictureFilesResponseEntities()
            .filter( ( e ) => !ids.includes( e.id ) )
          patchState(
            store,
            setAllEntities( m, { collection: PictureFilesResponseCollection } ),
          )
          this.setModified()
        }

        if ( source === store.filesAndPagesSource() ) {
          this.loadFirstPageIntoImageEditorState()
        }
      },

      deleteUploadedFiles( ids: string[], source: FilesAndPagesSource ): void {
        if ( source === 'request' ) {
          const m = store
            .uploadedFilesRequestEntities()
            .filter( ( e ) => !ids.includes( e.id ) )
          patchState(
            store,
            setAllEntities( m, { collection: UploadedFilesRequestCollection } ),
          )
          this.setModified()
        }
        if ( source === 'response' ) {
          const m = store
            .uploadedFilesResponseEntities()
            .filter( ( e ) => !ids.includes( e.id ) )
          patchState(
            store,
            setAllEntities( m, { collection: UploadedFilesResponseCollection } ),
          )
          this.setModified()
        }

        if ( source === store.filesAndPagesSource() ) {
          this.loadFirstPageIntoImageEditorState()
        }
      },

      makePdfFromPagesJob(
        pages: DocumentPage[],
        outPdfProperties?: PdfProperties,
      ): Observable<void> {
        const folder = doc4sFolder( store.id() )
        const request: MakePdfFromPicturesRequest = {
          folder,
          outPdfProperties,
          pages: pages.map( ( p ) => ({
            folder,
            src: p.pageImage!.src,
            stamps: p.stamps.map( ( s ) => ({
              src: s.imageDesc.src,
              position: s.position,
            }) ),
          }) ),
        }
        return http
          .post<ApiResult<AddJobResponseItem>>(
            cfg.config.apiAddress + BackendRoutes.doc4sComposePdfJob,
            request,
          )
          .pipe(
            catchError( ( err ) => {
              patchState( store, setError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map( ( res: ApiResult<AddJobResponseItem> | undefined ) => {
              if ( res?.payload ) {
                jobs.addToWatchList( {
                  ...res.payload,
                  title: 'Создание PDF',
                  onComplete: this.onPdfMade(
                    makeJobId( res.payload.queue, res.payload.jobId ),
                  ),
                  onFail: null,
                  removeFromWatchListAfterComplete: true,
                  removeFromWatchListAfterFail: true,
                } )
              }
            } ),
          )
      },

      onPdfMade( id: string ): Observable<number> {
        return of( 1 ).pipe(
          switchMap( () => {
            const data = deepClone( jobs.getJobData( id )!.result )
            this.makePdfFromPagesPatchState( data )
            return this.save()
          } ),
        )
      },

      makePdfFromPagesPatchState( data: MakePdfFromPicturesResponse ): void {
        const folder = doc4sFolder( store.id() )
        const resFile: ResultFile = {
          id: MyUtils.makeRandomId( 8 ),
          filePath: `${folder}${data.filename}`,
          title: 'New file.pdf',
          generatedByUserId: auth.state.user()?.id ?? null,
          generatedAt: new Date(),
        }
        patchState(
          store,
          addEntity( resFile, { collection: ResultFilesResponseCollection } ),
        )
        this.setModified()
      },

      makePdfFromPages(
        pages: DocumentPage[],
        outPdfProperties?: PdfProperties,
      ): Observable<void> {
        const folder = doc4sFolder( store.id() )
        const request: MakePdfFromPicturesRequest = {
          folder,
          outPdfProperties,
          pages: pages.map( ( p ) => ({
            folder,
            src: p.pageImage!.src,
            stamps: p.stamps.map( ( s ) => ({
              src: s.imageDesc.src,
              position: s.position,
            }) ),
          }) ),
        }
        return http
          .post<ApiResult<MakePdfFromPicturesResponse>>(
            cfg.config.apiAddress + BackendRoutes.doc4sComposePdf,
            request,
          )
          .pipe(
            catchError( ( err ) => {
              patchState( store, setError( err.status + ' ' + err.message ) )
              return of( undefined )
            } ),
            map( ( res: ApiResult<MakePdfFromPicturesResponse> | undefined ) => {
              if ( res?.payload ) {
                this.makePdfFromPagesPatchState( res.payload )
              }
            } ),
          )
      },

      deleteResultFiles( ids: string[] ): void {
        const m = store
          .resultFilesResponseEntities()
          .filter( ( e ) => !ids.includes( e.id ) )
        patchState(
          store,
          setAllEntities( m, { collection: ResultFilesResponseCollection } ),
        )
        this.setModified()
      },

      calcAccess(): void {
        const canEditRequest =
          store.authorId() === auth.state.user()?.id &&
          store.status() === 'draft'
        const canEditResponse =
          auth.canRespond() && store.status() === 'pending'
        const canEditProps = canEditRequest
        const canListAll = auth.canListAll()
        const disabledStatuses = fillStatusBooleanData( false )
        if ( !auth.canRespond() ) {
          disabledStatuses.approved = true
          disabledStatuses.declined = true
          if ( store.status() === 'pending' ) {
            disabledStatuses.draft = true
          }
        }
        patchState( store, {
          canEditRequest,
          canEditResponse,
          canEditProps,
          canListAll,
          disabledStatuses,
        } )
      },

      setModified(): void {
        patchState( store, setModified() )
        this.calcAccess()
      },
    }),
  ),

  withComputed(
    ( {
        type,
        incomingDocumentNumber,
        incomingDocumentDate,
        filesAndPagesSource,
        pictureFilesResponseEntities,
        pictureFilesRequestEntities,
        uploadedFilesRequestEntities,
        uploadedFilesResponseEntities,
        resultFilesResponseEntities,
      } ) => ({
      docAsString: computed( () =>
        docFields2str( type(), incomingDocumentNumber(), incomingDocumentDate() ),
      ),
      pictureFilesEntities: computed( (): DocumentPage[] => {
        if ( filesAndPagesSource() === 'response' ) {
          return pictureFilesResponseEntities()
        } else {
          return pictureFilesRequestEntities()
        }
      } ),
      uploadedFilesEntities: computed( (): UploadedFile[] => {
        if ( filesAndPagesSource() === 'response' ) {
          return uploadedFilesResponseEntities()
        } else {
          return uploadedFilesRequestEntities()
        }
      } ),
      isResponseEmpty: computed( () => {
        return (
          pictureFilesResponseEntities().length === 0 &&
          uploadedFilesResponseEntities().length === 0 &&
          resultFilesResponseEntities.length === 0
        )
      } ),
      isRequestEmpty: computed( () => {
        return (
          pictureFilesRequestEntities().length === 0 &&
          uploadedFilesRequestEntities().length === 0
        )
      } ),
    }),
  ),
)
