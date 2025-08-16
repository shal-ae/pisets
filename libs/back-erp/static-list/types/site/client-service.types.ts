import {StaticListItem} from '../static-list.types';

export interface SiteClientServiceItemData {
  svg: string
  name: string
  caption: string
}

export interface SiteClientServiceItem extends StaticListItem<SiteClientServiceItemData> {
}
