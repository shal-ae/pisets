export interface PagerOrderItem {
  id: string;
  caption: string;
  group: string;
  sql: string;
}

export interface PagerViewItem {
  id: string;
  caption: string;
  itemParams?: {
    width: number;
    height: number;
  };
}

export type FilterValueToSqlFunc<T = unknown> = (
  filterItem: PagerFilterItem<T>,
  value: T,
) => string;

export interface PagerFilterItem<T = unknown> {
  id: string;
  caption: string;
  valueToSql: FilterValueToSqlFunc<T>;
}

export type PagerConfig = {
  getListUrl: string;
  upsertUrl?: string;
  deleteUrl?: string;

  orderItems?: PagerOrderItem[];
  defaultOrderItems?: string[];

  itemsOnPageItems?: number[];
  defaultItemsOnPage?: number;

  viewItems?: PagerViewItem[];
  defaultView?: string;

  filterItems?: PagerFilterItem<unknown>[];
  defaultFilters?: PagerStateFilterItem[];
};

export interface PagerStateFilterItem {
  filterId: string;
  active: boolean;
  value: unknown;
}
