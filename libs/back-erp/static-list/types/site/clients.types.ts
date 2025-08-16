import {StaticListItem} from '@app/back/static-list/types/static-list.types';

export interface SiteClientData {
  file: string
  name: string
  url?: string
}

export interface SiteClientItem extends StaticListItem<SiteClientData> {
}
