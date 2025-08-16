import { inject } from '@angular/core'
import { signalStoreFeature, withMethods, withState } from '@ngrx/signals'
import {
  FilesAndPagesSource,
} from '../../../pages/doc4s/doc4s-edit-page/ui/files-and-pages-lists/files-and-pages-lists.component'
import { AuthService } from '../../services/auth.service'
import { AccessFieldsState, DefaultAccess } from './access-fields.types'

type FilesAndPagesSourceAndSelectedPage = {
  filesAndPagesSource: FilesAndPagesSource | null;
  selectedPageId: string | null;
};

export function withDoc4sAdd() {
  return signalStoreFeature(
    withState<FilesAndPagesSourceAndSelectedPage>( {
      filesAndPagesSource: null,
      selectedPageId: null,
    } ),
    withState<AccessFieldsState>( DefaultAccess ),
    withMethods( ( store, auth = inject( AuthService ) ) => ({}) ),
  )
}
