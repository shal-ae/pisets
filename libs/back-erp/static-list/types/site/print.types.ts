import {StaticListItem} from '../static-list.types';

export interface SitePrintMethodData {
  slug: string
  caption: string
  description: string
  img: string
  detailPageData: SiteDetailPageData
}

export interface SitePrintMethod extends StaticListItem<SitePrintMethodData> {
}

export interface SiteDetailPageData {
  text: string
  priceText: string
  prosText: string
  pros: string[]
  slides: SitePrintMethodSlideItem[]
}

export interface SitePrintMethodSlideItem {
  path: string
  caption: string
  imageAlt?: string
}
