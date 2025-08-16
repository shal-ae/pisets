import { signalStore } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { PagerConfig, withLoadStatus, withPagerList, withUploadFile } from 'libs/front/core/store/src'
import { BackendRoutes } from '../types/backend.routes'
import { Stamp } from '../types/stamp.types'

const CONFIG: PagerConfig = {
  getListUrl: BackendRoutes.stampsList,
  upsertUrl: BackendRoutes.stampsUpsert,
  deleteUrl: BackendRoutes.stampsDelete,

  orderItems: [
    { id: 'sort', caption: 'sort', group: 'sort', sql: 'sort, id' },
    //  {id: 'id', caption: 'id', group: 'id', sql: 'id'},
  ],
  defaultOrderItems: [ 'sort' ],

  itemsOnPageItems: [ 10, 0 ],
  defaultItemsOnPage: 10,
}

export const StampStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withEntities<Stamp>(),
  withLoadStatus(),
  withPagerList<Stamp>( CONFIG ),
  withUploadFile(),
)
