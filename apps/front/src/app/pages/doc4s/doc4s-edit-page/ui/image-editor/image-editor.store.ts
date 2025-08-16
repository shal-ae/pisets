import { computed } from '@angular/core'
import { getState, patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals'
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities'
import { deepClone } from 'libs/core/core-utils'
import { RectChangeEvent } from 'libs/front/core/ui/src'
import { ImageDesc } from '../../../../../shared/types/image-desc.types'
import { DocumentPage } from '../pages-editor/pages-editor.types'
import { PageZoom, StampItem, TEST_IMAGE_EDITOR_DATA } from './image-editor.types'

export type PageImageState = { pageImage: ImageDesc | null };
export type FocusedStampId = { focusedStampId: number | null };
export type DocumentImageRectState = {
  documentImageRect: DOMRectReadOnly | undefined;
};
export type PageZoomState = { pageZoom: PageZoom };

export const StampItemCollection = 'stamps'

export const ImageEditorStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState<PageImageState>( { pageImage: null } ),
  withState<PageZoomState>( { pageZoom: 'height' } ),
  withState<DocumentImageRectState>( { documentImageRect: undefined } ),
  withEntities( { entity: type<StampItem>(), collection: StampItemCollection } ),
  withState<FocusedStampId>( { focusedStampId: null } ),
  withComputed( ( { focusedStampId, stampsEntityMap } ) => ({
    focusedStamp: computed( () =>
      focusedStampId() !== null ? stampsEntityMap()[ focusedStampId()! ] : null,
    ),
  }) ),
  withComputed( ( { documentImageRect, pageImage } ) => ({
    pixelPerMm: computed( () => {
      if (
        (documentImageRect()?.width ?? 0) > 0 &&
        (pageImage()?.widthMm || 0) > 0
      ) {
        return documentImageRect()!.width / pageImage()!.widthMm
      } else {
        return undefined
      }
    } ),
  }) ),
  withMethods( ( store ) => ({
    reset(): void {
      patchState(
        store,
        { pageImage: null },
        { documentImageRect: undefined },
        removeAllEntities( { collection: StampItemCollection } ),
        { focusedStampId: null },
      )
    },

    loadData( documentPage: DocumentPage ): void {
      patchState(
        store,
        { pageImage: documentPage.pageImage },
        setAllEntities( documentPage.stamps, { collection: StampItemCollection } ),
      )
    },

    loadTestData(): void {
      patchState( store, { pageImage: TEST_IMAGE_EDITOR_DATA.pageImage } )
    },

    addStamp( imageDesc: ImageDesc, left = 50, top = 50 ): void {
      const stampItem: StampItem = {
        id: new Date().getTime(),
        imageDesc,
        position: {
          left,
          top,
          width: imageDesc.widthMm,
          height: imageDesc.heightMm,
        },
      }
      patchState(
        store,
        addEntity( stampItem, { collection: StampItemCollection } ),
        { focusedStampId: stampItem.id },
      )
    },

    changeStampWhenDragged(
      stampId: number | string,
      positionChangeEvent: RectChangeEvent,
    ) {
      if ( !store.documentImageRect()?.width || !store.pixelPerMm() ) {
        return
      }

      const state = getState( store )
      const stampItem = deepClone( state.stampsEntityMap[ stampId ] )

      const pixelPerMm = store.pixelPerMm()!
      stampItem.position = {
        left: positionChangeEvent.currentPosition.left / pixelPerMm,
        top: positionChangeEvent.currentPosition.top / pixelPerMm,
        width: positionChangeEvent.currentPosition.width / pixelPerMm,
        height: positionChangeEvent.currentPosition.height / pixelPerMm,
      }

      patchState(
        store,
        setEntity( stampItem, { collection: StampItemCollection } ),
      )
    },

    autoChangeFocused( stampId: number, focused: boolean ): void {
      if ( focused ) {
        patchState( store, { focusedStampId: stampId } )
      } else {
        if ( store.focusedStampId() === stampId ) {
          patchState( store, { focusedStampId: null } )
        }
      }
    },

    changeFocused( focusedStampId: number | null ): void {
      patchState( store, { focusedStampId } )
    },

    deleteStamp( stampId: number | null ): void {
      if ( stampId ) {
        patchState(
          store,
          removeEntity( stampId, { collection: StampItemCollection } ),
          { focusedStampId: null },
        )
      }
    },

    deleteStampAll(): void {
      patchState(
        store,
        removeAllEntities( { collection: StampItemCollection } ),
        { focusedStampId: null },
      )
    },

    cloneStamp( stampId: number ): void {
      const stampItem = deepClone( store.stampsEntityMap()[ stampId ] )
      stampItem.id = new Date().getTime()
      stampItem.position.left += 10
      stampItem.position.top += 10
      patchState(
        store,
        addEntity( stampItem, { collection: StampItemCollection } ),
        { focusedStampId: stampItem.id },
      )
    },

    restoreSizesOfStamp( stampId: number ): void {
      const stampItem = deepClone( store.stampsEntityMap()[ stampId ] )
      stampItem.position.width = stampItem.imageDesc.widthMm
      stampItem.position.height = stampItem.imageDesc.heightMm
      patchState(
        store,
        setEntity( stampItem, { collection: StampItemCollection } ),
      )
    },
  }) ),
)
