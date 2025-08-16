import {Schedule} from '../../types/schedule.types';

export enum CatCatalogType {
  oasis = 'oasis',
  gifts = 'gifts',
  happy = 'happy',
  ocean = 'ocean',
  portobello = 'portobello',
  artegifts = 'artegifts'
}

export interface DefaultCatalogParams {
  name: string,
  site: string,
  code: string,
  scheduleDownloadProducts: Schedule,
  scheduleDownloadStock: Schedule,
  cloudCatalogId: string,
}

export const scheduleDefaultDownloadStock: Readonly<Schedule> = {
  daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
  expiresInMinutes: 30,
  timeToStartFromStr: '07:00',
  timeToStartToStr: '19:00',
}

export function getDefaultCatalogParams(catalogType: string): DefaultCatalogParams {
  switch (catalogType) {
    case CatCatalogType.gifts:
      return <DefaultCatalogParams>{
        name: 'Проект 111',
        site: 'https://gifts.ru/',
        code: 'gifts',
        scheduleDownloadProducts: {
          daysOfWeek: [1, 3, 5],
          expiresInMinutes: 60 * 24,
          timeToStartFromStr: '04:00',
          timeToStartToStr: '09:00',
        },
        scheduleDownloadStock: scheduleDefaultDownloadStock,
        cloudCatalogId: '2',
      }
    case CatCatalogType.oasis:
      return {
        name: 'Оазис',
        site: 'https://www.oasiscatalog.com/',
        code: 'oasis',
        scheduleDownloadProducts: {
          daysOfWeek: [2, 4],
          expiresInMinutes: 60 * 24,
          timeToStartFromStr: '04:00',
          timeToStartToStr: '09:00',
        },
        scheduleDownloadStock: scheduleDefaultDownloadStock,
        cloudCatalogId: '3',
      }
    case CatCatalogType.happy:
      return {
        name: 'Happy gifts',
        site: 'https://happygifts.ru/',
        code: 'happy',
        scheduleDownloadProducts: {
          daysOfWeek: [1],
          expiresInMinutes: 60 * 24,
          timeToStartFromStr: '04:00',
          timeToStartToStr: '09:00',
        },
        scheduleDownloadStock: scheduleDefaultDownloadStock,
        cloudCatalogId: '4',
      }
    case CatCatalogType.ocean:
      return {
        name: 'Океан',
        site: 'https://www.oceangifts.ru/',
        code: 'ocean',
        scheduleDownloadProducts: {
          daysOfWeek: [3],
          expiresInMinutes: 60 * 24,
          timeToStartFromStr: '04:00',
          timeToStartToStr: '09:00',
        },
        scheduleDownloadStock: scheduleDefaultDownloadStock,
        cloudCatalogId: '5',
      }
    case CatCatalogType.portobello:
      return {
        name: 'Portobello',
        site: 'https://portobello.ru/',
        code: 'portobello',
        scheduleDownloadProducts: {
          daysOfWeek: [2],
          expiresInMinutes: 60 * 24,
          timeToStartFromStr: '04:00',
          timeToStartToStr: '09:00',
        },
        scheduleDownloadStock: scheduleDefaultDownloadStock,
        cloudCatalogId: '6',
      }
    case CatCatalogType.artegifts:
      return <DefaultCatalogParams>{
        name: 'Artegifts',
        site: 'https://artegifts.by/',
        code: 'artegifts',
        scheduleDownloadProducts: {
          daysOfWeek: [1, 3, 5],
          expiresInMinutes: 60 * 24,
          timeToStartFromStr: '04:00',
          timeToStartToStr: '09:00',
        },
        scheduleDownloadStock: scheduleDefaultDownloadStock,
        cloudCatalogId: '7',
      }
  }
}

