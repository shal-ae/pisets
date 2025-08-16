import {StaticListItem} from '../static-list.types';

export interface SiteProsItemData {
  svg: string
  name: string
  caption: string
}

export interface SiteProsItem extends StaticListItem<SiteProsItemData> {
}
