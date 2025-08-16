import { signalStoreFeature, type } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { DocumentPage } from '../../../pages/doc4s/doc4s-edit-page/ui/pages-editor/pages-editor.types'
import {
  PictureFilesRequestCollection,
  PictureFilesResponseCollection,
  ResultFile,
  ResultFilesResponseCollection,
  StatusesCollection,
  StatusTrackItem,
  UploadedFile,
  UploadedFilesRequestCollection,
  UploadedFilesResponseCollection,
} from '../../types/doc4s.types'

export function withDoc4sTables() {
  return signalStoreFeature(
    withEntities( {
      entity: type<UploadedFile>(),
      collection: UploadedFilesRequestCollection,
    } ),
    withEntities( {
      entity: type<DocumentPage>(),
      collection: PictureFilesRequestCollection,
    } ),
    withEntities( {
      entity: type<UploadedFile>(),
      collection: UploadedFilesResponseCollection,
    } ),
    withEntities( {
      entity: type<DocumentPage>(),
      collection: PictureFilesResponseCollection,
    } ),
    withEntities( {
      entity: type<ResultFile>(),
      collection: ResultFilesResponseCollection,
    } ),
    withEntities( {
      entity: type<StatusTrackItem>(),
      collection: StatusesCollection,
    } ),
  )
}
