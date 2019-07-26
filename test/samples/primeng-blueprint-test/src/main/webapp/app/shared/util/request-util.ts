import { HttpParams } from '@angular/common/http';
import { LazyLoadEvent } from 'primeng/api';
import { ITEMS_PER_PAGE } from 'app/shared';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });
    if (req.sort) {
      req.sort.forEach(val => {
        options = options.append('sort', val);
      });
    }
  }
  return options;
};

export const lazyLoadEventToQueryParams = (event: LazyLoadEvent) => {
  const params = {};
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
  if (event.multiSortMeta) {
    params['sort'] = event.multiSortMeta.map(s => s.field + (s.order === -1 ? ',desc' : ',asc'));
  }
  params['page'] = event.first / event.rows || 0;
  params['size'] = event.rows || ITEMS_PER_PAGE;
  return params;
};
