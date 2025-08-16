import {StaticListItem} from '../static-list.types';

export interface SiteProductsMenuItem extends StaticListItem<SiteProductsMenuItemData> {
}

export interface SiteProductsMenuItemData {
  slug: string
  caption: string
  row: number
  img: string
  title: string
  banner: string
  text: string
  works: SiteProductsMenuItemWork[]
  seo: SiteProductsMenuItemSEO
  subcategories: SiteProductsSubcategoryItem[]
}

export interface SiteProductsMenuItemSEO {
  title: string
  keywords: string
  description: string
}

export interface SiteProductsMenuItemWork {
  file: string
}

export interface SiteProductsSubcategoryItem {
// Артикул со старого сайта чтобы найти товар, например   02-23424.34
  art?: string

  // Надпись подкатегории
  name: string

// Файл в каталоге files  картинки на сайте cat.rk-a.ru для отображения подкатегории
  // например  catalog/3/th/200/05/f6/05f66594cb2399ea37f1d.jpg",
  //       "link": "/catalog/20880
  img: string

// ссылка на локальном сайте, например  /catalog/3433
  link: string

  // Основная категория товара
  categoryId?: number

}

