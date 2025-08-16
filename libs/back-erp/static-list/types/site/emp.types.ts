import {StaticListItem} from '../static-list.types';

export interface SiteEmpItem extends StaticListItem<SiteEmpItemData> {
}

export interface SiteEmpItemData {
  img: string
  name: string
  position: string
}
