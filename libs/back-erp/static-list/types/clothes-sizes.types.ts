import {StaticListItem} from '@app/back/static-list/types/static-list.types';

export interface ClothesSizeItemData {
  name: string
  productSizeCount: number
}

export interface ClothesSizeItem extends StaticListItem<ClothesSizeItemData> {
}
