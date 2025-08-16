import {StaticListItem} from '@app/back/static-list/types/static-list.types';

export interface SiteHitsData {
  productId: number
  article: string
  name: string
  price: number
  picture: string
}

export interface SiteHitsItem extends StaticListItem<SiteHitsData> {
}
