import {StaticListItem} from '../static-list.types';

export interface SitePartnerItemData {
  caption: string,
  link: string
}

export interface SitePartnerItem extends StaticListItem<SitePartnerItemData> {
}
