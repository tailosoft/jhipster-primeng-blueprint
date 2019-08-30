import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, tap, take, debounceTime, switchMap } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployee } from 'app/shared/model/employee.model';
import { ITEMS_PER_PAGE } from 'app/shared';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { EmployeeService } from './employee.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { Table } from 'primeng/table';
import { flatten, unflatten } from 'flat';

@Component({
  selector: 'jhi-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit, OnDestroy, AfterViewInit {
  employees: IEmployee[];
  eventSubscriber: Subscription;

  totalItems: number;
  itemsPerPage: number;
  loading: boolean;

  @ViewChild('employeeTable', { static: false })
  employeeTable: Table;

  constructor(
    protected employeeService: EmployeeService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.loading = true;
  }

  ngOnInit() {
    this.registerChangeInEmployees();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  ngAfterViewInit() {
    const lazyLoadEvent$ = this.activatedRoute.queryParams.pipe(
      debounceTime(300),
      map(data => <LazyLoadEvent>(<any>unflatten(data)).lle)
    );

    lazyLoadEvent$
      .pipe(
        take(1),
        filter(event => event !== undefined)
      )
      .subscribe(event => {
        Object.assign(this.employeeTable, event);
      });

    lazyLoadEvent$
      .pipe(
        map(event => lazyLoadEventToQueryParams(event || {})),
        tap(() => (this.loading = true)),
        switchMap(params => this.employeeService.query(params)),
        filter((res: HttpResponse<IEmployee[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<IEmployee[]>) => {
          this.paginateEmployees(res.body, res.headers);
          this.loading = false;
        },
        (res: HttpErrorResponse) => {
          this.onError(res.message);
          this.loading = false;
        }
      );
  }

  onLazyLoadEvent(event: LazyLoadEvent) {
    const queryParams = flatten({ lle: event });
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && typeof value === 'object' && Object.entries(value).length === 0) {
        delete queryParams[key];
      }
    });
    this.router.navigate(['/employee'], {
      queryParams
    });
  }

  delete(username: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.employee.delete.question', { id: username }),
      accept: () => {
        this.employeeService.delete(username).subscribe(() => {
          this.eventManager.broadcast({
            name: 'employeeListModification',
            content: 'Deleted an employee'
          });
        });
      }
    });
  }

  trackId(index: number, item: IEmployee) {
    return item.username;
  }

  registerChangeInEmployees() {
    this.eventSubscriber = this.eventManager.subscribe('employeeListModification', response =>
      this.router.navigate(['/employee'], { queryParams: { r: Date.now() } })
    );
  }

  protected paginateEmployees(data: IEmployee[], headers: HttpHeaders) {
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.employees = data;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
