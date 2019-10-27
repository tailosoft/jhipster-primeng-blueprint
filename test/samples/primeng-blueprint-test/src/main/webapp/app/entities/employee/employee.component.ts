import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap, switchMap } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from './employee.service';
import { ITEMS_PER_PAGE } from 'app/shared';
import {
  computeFilterMatchMode,
  lazyLoadEventToServerQueryParams,
  lazyLoadEventToRouterQueryParams,
  fillTableFromQueryParams
} from 'app/shared/util/request-util';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'jhi-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit, OnDestroy {
  employees: IEmployee[];
  eventSubscriber: Subscription;

  totalItems: number;
  itemsPerPage: number;
  loading: boolean;

  private filtersDetails: { [_: string]: { matchMode?: string; flatten?: (_: any) => string; unflatten?: (_: string) => any } } = {};

  @ViewChild('employeeTable', { static: true })
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
    this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => fillTableFromQueryParams(this.employeeTable, queryParams, this.filtersDetails)),
        tap(() => (this.loading = true)),
        switchMap(() => this.employeeService.query(lazyLoadEventToServerQueryParams(this.employeeTable.createLazyLoadMetadata()))),
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

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  onLazyLoadEvent(event: LazyLoadEvent) {
    const queryParams = lazyLoadEventToRouterQueryParams(event, this.filtersDetails);
    this.router.navigate(['/employee'], { queryParams });
  }

  filter(value, field) {
    this.employeeTable.filter(value, field, computeFilterMatchMode(this.filtersDetails[field]));
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
