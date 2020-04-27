import { HttpParams } from '@angular/common/http';
import { FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { flatten, unflatten } from 'flat';
import { Params } from '@angular/router';
import { Table } from 'primeng/table';

export const computeFilterMatchMode = (filterDetails: { matchMode?: string }): string => {
  return (filterDetails && filterDetails.matchMode) || 'contains';
};

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();

  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });

    if (req.sort) {
      req.sort.forEach((val: string) => {
        options = options.append('sort', val);
      });
    }
  }

  return options;
};

export const lazyLoadEventToServerQueryParams = (event?: LazyLoadEvent, globalFilter?: string) => {
  const params = {};
  if (event) {
    if (event.filters) {
      for (const filterField of Object.keys(event.filters)) {
        if (event.filters[filterField].matchMode === 'between') {
          if (event.filters[filterField].value[0]) {
            params[filterField + '.greaterOrEqualThan'] = event.filters[filterField].value[0];
          }
          if (event.filters[filterField].value[1]) {
            params[filterField + '.lessOrEqualThan'] = event.filters[filterField].value[1];
          }
        } else {
          params[filterField + '.' + event.filters[filterField].matchMode] = event.filters[filterField].value;
        }
      }
    }
    if (event.globalFilter && globalFilter) {
      params[globalFilter] = event.globalFilter;
    }
    if (event.multiSortMeta) {
      params['sort'] = event.multiSortMeta.map(s => s.field + (s.order === -1 ? ',desc' : ',asc'));
    }
    params['page'] = (event.first || 0) / (event.rows || ITEMS_PER_PAGE);
    params['size'] = event.rows || ITEMS_PER_PAGE;
  } else {
    params['size'] = ITEMS_PER_PAGE;
  }
  return params;
};

export const fillTableFromQueryParams = (
  table: Table,
  queryParams: Params,
  filtersDetails: { [_: string]: { matchMode?: string; unflatten?: Function } }
) => {
  const params: any = unflatten(queryParams);
  table.first = +queryParams.first || 0;
  table.multiSortMeta = (params['msm'] || []).map((sm: any) => ({ field: sm.field, order: +sm.order }));
  const filters = {};
  if (params['f']) {
    Object.entries(params['f']).forEach(
      ([field, value]) =>
        (filters[field] = {
          value: (filtersDetails[field] && filtersDetails[field].unflatten && filtersDetails[field].unflatten!(value)) || value,
          matchMode: computeFilterMatchMode(filtersDetails[field])
        })
    );
  }
  table.filters = filters;
};

export const lazyLoadEventToRouterQueryParams = (
  event: LazyLoadEvent,
  filtersDetails: { [_: string]: { matchMode?: string; flatten?: Function } }
): Params => {
  const queryParams: { [_: string]: any } = {};
  if (event) {
    if (event.first) {
      queryParams['first'] = event.first;
    }
    if (event.multiSortMeta && event.multiSortMeta.length) {
      queryParams['msm'] = event.multiSortMeta;
    }
    if (event.filters) {
      Object.entries(event.filters).forEach(([field, filter]: [string, FilterMetadata]) => {
        let filterValue = filter.value;
        if (filterValue && filtersDetails[field] && filtersDetails[field].flatten) {
          filterValue = filtersDetails[field].flatten!(filterValue);
        }
        queryParams[`f.${field}`] = filterValue;
      });
    }
  }
  return flatten(queryParams);
};
