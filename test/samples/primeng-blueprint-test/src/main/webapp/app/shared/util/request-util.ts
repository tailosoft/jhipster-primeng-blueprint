import { HttpParams } from '@angular/common/http';
import { FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
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

export const fillTableFromQueryParams = (table: Table, queryParams: Params, filtersDetails: { [_: string]: { type: string } }): void => {
  const params: any = unflatten(queryParams);
  table.first = +queryParams.first || 0;
  table.multiSortMeta = (params['msm'] || []).map((sm: any) => ({ field: sm.field, order: +sm.order }));
  const filters: { [_: string]: FilterMetadata | FilterMetadata[] } = {};
  if (params['f']) {
    Object.entries(flatten(params['f'], { safe: true })).forEach(([field, value]) => {
      let filterName = field;
      let filterValue = value;
      if (filterName === 'globalFilter') {
        filters[filterName] = {
          value: filterName
        };
      } else {
        const matchMode = Object.keys(matchModes).find(mm => field.endsWith(`.${mm}`));
        if (matchMode) {
          filterName = field.substring(0, -matchMode.length - 1); // -1 for the dot (.)
        }
        if (matchMode === FilterMatchMode.IN) {
          filterValue = (value as string).split(',');
          filterValue = (filterValue as string[]).map(fv => deserializeFilter(fv, filtersDetails[filterName].type));
        } else {
          filterValue = deserializeFilter(filterValue as string, filtersDetails[filterName].type);
        }
        if (!filters[filterName]) {
          filters[filterName] = [];
        }
        (filters[filterName] as FilterMetadata[]).push({
          value: filterValue,
          matchMode: matchMode
        });
      }
    });
  }
  table.filters = filters;
};

export const lazyLoadEventToRouterQueryParams = (event: LazyLoadEvent, filtersDetails: { [_: string]: { type: string } }): Params => {
  const queryParams: { [_: string]: any } = {};
  if (event.first) {
    queryParams['first'] = event.first;
  }
  if (event.multiSortMeta?.length) {
    queryParams['msm'] = event.multiSortMeta;
  }
  if (event.filters) {
    Object.entries(event.filters).forEach(([field, filterMetas]: [string, FilterMetadata | FilterMetadata[]]) => {
      if (!Array.isArray(filterMetas)) {
        filterMetas = [filterMetas];
      }
      filterMetas.forEach(filter => {
        const matchMode = filter.matchMode;
        let filterValue = filter.value;
        if (matchMode === 'in') {
          filterValue = filterValue.join(',');
        }
        const paramKey = matchMode ? `f.${field}.${matchMode}` : `f.${field}`;
        queryParams[paramKey] = filterValue;
      });
    });
  }
  // return flatten(queryParams);
  return queryParams;
};

const deserializeFilter = (value: string, type: string): any => {
  if (type === 'number') {
    return +value;
  }
  if (type === 'date') {
    return new Date(value);
  }
  if (type === 'boolean') {
    return value === 'true';
  }
  return value;
};

const matchModes = {
  [FilterMatchMode.STARTS_WITH]: 'contains',
  [FilterMatchMode.CONTAINS]: 'contains',
  [FilterMatchMode.ENDS_WITH]: 'contains',
  [FilterMatchMode.EQUALS]: 'equals',
  [FilterMatchMode.NOT_EQUALS]: 'notEquals',
  [FilterMatchMode.IN]: 'in',
  [FilterMatchMode.LESS_THAN]: 'lessThan',
  [FilterMatchMode.LESS_THAN_OR_EQUAL_TO]: 'lessThanOrEqual',
  [FilterMatchMode.GREATER_THAN]: 'greaterThan',
  [FilterMatchMode.GREATER_THAN_OR_EQUAL_TO]: 'greaterThanOrEqual',
  [FilterMatchMode.IS]: 'equals',
  [FilterMatchMode.IS_NOT]: 'notEquals',
  [FilterMatchMode.BEFORE]: 'lessThanOrEqual',
  [FilterMatchMode.AFTER]: 'greaterThanOrEqual',
  [FilterMatchMode.IS]: 'equals',
  [FilterMatchMode.IS_NOT]: 'notEquals',
  [FilterMatchMode.BEFORE]: 'lte',
  [FilterMatchMode.AFTER]: 'gte'
};
