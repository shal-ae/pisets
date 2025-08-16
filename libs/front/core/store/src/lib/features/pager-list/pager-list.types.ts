import { EntityId } from '@ngrx/signals/entities'
import { PagerConfig, PagerStateFilterItem } from './pager.types'

export type PagerListState = {
  view: string;

  filters: PagerStateFilterItem[];
  order: string[];
  itemsOnPage: number;
  page: number;

  total: number;
  pageCount: number;
};

export function defaultPagerListState( config: PagerConfig ): PagerListState {
  return {
    view: config.defaultView || '',
    filters: config.defaultFilters || [],
    order: config.defaultOrderItems || [],
    itemsOnPage: config.defaultItemsOnPage || 0,
    page: 1,
    total: 0,
    pageCount: 0,
  }
}

export interface Entity {
  id: EntityId;
}

export interface EntityListDTO<T extends Entity> {
  data: T[];
}

export interface PagerListServiceResponse<T extends Entity> {
  data: T[];
  total: number;
}

export interface PagerListServiceRequest {
  filters: PagerStateFilterItem[];
  order: string[];
  itemsOnPage: number;
  page: number;
}

export class PagerListQueryParams {
  whereClause?: string
  orderByClause?: string
  offset?: number
  limit?: number
  countTotal?: boolean
}
