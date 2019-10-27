import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap, switchMap } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from './employee-skill.service';
import { ITEMS_PER_PAGE } from 'app/shared';
import {
  computeFilterMatchMode,
  lazyLoadEventToServerQueryParams,
  lazyLoadEventToRouterQueryParams,
  fillTableFromQueryParams
} from 'app/shared/util/request-util';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ITask } from 'app/shared/model/task.model';
import { TaskService } from 'app/entities/task';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee';
import { Table } from 'primeng/table';

@Component({
  selector: 'jhi-employee-skill',
  templateUrl: './employee-skill.component.html'
})
export class EmployeeSkillComponent implements OnInit, OnDestroy {
  employeeSkills: IEmployeeSkill[];
  eventSubscriber: Subscription;
  taskOptions: ITask[];
  employeeOptions: IEmployee[];
  teacherOptions: IEmployee[];

  totalItems: number;
  itemsPerPage: number;
  loading: boolean;

  private filtersDetails: { [_: string]: { matchMode?: string; flatten?: (_: any) => string; unflatten?: (_: string) => any } } = {
    level: { matchMode: 'equals', unflatten: x => +x },
    taskId: { matchMode: 'in', flatten: a => a.join(','), unflatten: a => a.split(',').map(x => +x) },
    employeeUsername: { matchMode: 'in' },
    teacherUsername: { matchMode: 'in' }
  };

  @ViewChild('employeeSkillTable', { static: true })
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
    this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => fillTableFromQueryParams(this.employeeSkillTable, queryParams, this.filtersDetails)),
        tap(() => (this.loading = true)),
        switchMap(() =>
          this.employeeSkillService.query(lazyLoadEventToServerQueryParams(this.employeeSkillTable.createLazyLoadMetadata()))
        ),
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

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  onLazyLoadEvent(event: LazyLoadEvent) {
    const queryParams = lazyLoadEventToRouterQueryParams(event, this.filtersDetails);
    this.router.navigate(['/employee-skill'], { queryParams });
  }

  filter(value, field) {
    this.employeeSkillTable.filter(value, field, computeFilterMatchMode(this.filtersDetails[field]));
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
      .query(lazyLoadEventToServerQueryParams(event || {}, 'fullname.contains'))
      .subscribe(res => (this.employeeOptions = res.body));
  }

  onTeacherLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeService
      .query(lazyLoadEventToServerQueryParams(event || {}, 'fullname.contains'))
      .subscribe(res => (this.teacherOptions = res.body));
  }

  trackId(index: number, item: IEmployeeSkill) {
    return item.name + ',' + item.employeeUsername;
  }

  registerChangeInEmployeeSkills() {
    this.eventSubscriber = this.eventManager.subscribe('employeeSkillListModification', response =>
      this.router.navigate(['/employee-skill'], { queryParams: { r: Date.now() } })
    );
  }

  protected paginateEmployeeSkills(data: IEmployeeSkill[], headers: HttpHeaders) {
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.employeeSkills = data;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
