import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, tap, take, debounceTime, switchMap } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { ITEMS_PER_PAGE } from 'app/shared';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { EmployeeSkillService } from './employee-skill.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ITask } from 'app/shared/model/task.model';
import { TaskService } from 'app/entities/task';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee';

import { Table } from 'primeng/table';
import { flatten, unflatten } from 'flat';

@Component({
  selector: 'jhi-employee-skill',
  templateUrl: './employee-skill.component.html'
})
export class EmployeeSkillComponent implements OnInit, OnDestroy, AfterViewInit {
  employeeSkills: IEmployeeSkill[];
  eventSubscriber: Subscription;
  taskOptions: ITask[];
  employeeOptions: IEmployee[];
  teacherOptions: IEmployee[];

  totalItems: number;
  itemsPerPage: number;
  loading: boolean;

  @ViewChild('employeeSkillTable', { static: false })
  employeeSkillTable: Table;

  constructor(
    protected employeeSkillService: EmployeeSkillService,
    protected taskService: TaskService,
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
    this.loadAllTasks();
    this.registerChangeInEmployeeSkills();
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
        Object.assign(this.employeeSkillTable, event);
        if (event.filters && event.filters.level) {
          this.employeeSkillTable.filters.level.value = +event.filters.level.value;
        }
        if (event.filters && event.filters.taskId && event.filters.taskId.value) {
          this.employeeSkillTable.filters.taskId.value = event.filters.taskId.value.map(x => +x);
        }
        if (event.filters && event.filters.employeeUsername && event.filters.employeeUsername.value) {
          this.employeeSkillTable.filters.employeeUsername.value = event.filters.employeeUsername.value.map(x => +x);
        }
        if (event.filters && event.filters.teacherUsername && event.filters.teacherUsername.value) {
          this.employeeSkillTable.filters.teacherUsername.value = event.filters.teacherUsername.value.map(x => +x);
        }
      });

    lazyLoadEvent$
      .pipe(
        map(event => lazyLoadEventToQueryParams(event || {})),
        tap(() => (this.loading = true)),
        switchMap(params => this.employeeSkillService.query(params)),
        filter((res: HttpResponse<IEmployeeSkill[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<IEmployeeSkill[]>) => {
          this.paginateEmployeeSkills(res.body, res.headers);
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
    this.router.navigate(['/employee-skill'], {
      queryParams
    });
  }

  delete(name: string, employeeUsername: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.employeeSkill.delete.question', { id: name + ',' + employeeUsername }),
      accept: () => {
        this.employeeSkillService.delete(name, employeeUsername).subscribe(() => {
          this.eventManager.broadcast({
            name: 'employeeSkillListModification',
            content: 'Deleted an employeeSkill'
          });
        });
      }
    });
  }

  loadAllTasks() {
    this.taskService.query().subscribe(res => (this.taskOptions = res.body));
  }

  onEmployeeLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeService
      .query(lazyLoadEventToQueryParams(event || {}, 'fullname.contains'))
      .subscribe(res => (this.employeeOptions = res.body));
  }

  onTeacherLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeService
      .query(lazyLoadEventToQueryParams(event || {}, 'fullname.contains'))
      .subscribe(res => (this.teacherOptions = res.body));
  }

  trackId(index: number, item: IEmployeeSkill) {
    return item.name + ',' + item.employeeUsername;
  }

  registerChangeInEmployeeSkills() {
    this.eventSubscriber = this.eventManager.subscribe('employeeSkillListModification', response => this.employeeSkillTable.ngOnInit());
  }

  protected paginateEmployeeSkills(data: IEmployeeSkill[], headers: HttpHeaders) {
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.employeeSkills = data;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
