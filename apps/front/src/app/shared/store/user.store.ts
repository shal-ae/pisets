import { signalStore, withMethods } from '@ngrx/signals'
import { withEntities } from '@ngrx/signals/entities'
import { PagerConfig, withLoadStatus, withPagerList } from '@rka/store';
import { BackendRoutes } from '../types/backend.routes'
import { User } from '../types/user.types'

const CONFIG: PagerConfig = {
  getListUrl: BackendRoutes.usersList,
  upsertUrl: BackendRoutes.usersUpsert,
  deleteUrl: BackendRoutes.usersDelete,

  orderItems: [
    { id: 'name', caption: 'Имя', group: 'name', sql: 'name' },
    {
      id: 'createdAt',
      caption: 'Создано',
      group: 'createdAt',
      sql: '"createdAt"',
    },
    { id: 'email', caption: 'Email', group: 'email', sql: 'email' },
  ],
  defaultOrderItems: [ 'name' ],

  // itemsOnPageItems: [ 10, 15, 20, 50, 0 ],
  // defaultItemsOnPage: 15,
}

export const UserStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withEntities<User>(),
  withLoadStatus(),
  withPagerList<User>( CONFIG ),
  withMethods( ( store ) => ({
    getAdminCount(): number {
      return store.entities().filter( ( e ) => e.access?.isCompanyAdmin ).length
    },
  }) ),
)
