import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, tap, take, debounceTime, switchMap } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { ITaskComment } from 'app/shared/model/task-comment.model';

import { ITEMS_PER_PAGE } from 'app/shared';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { TaskCommentService } from './task-comment.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ITask } from 'app/shared/model/task.model';
import { TaskService } from 'app/entities/task';

import { Table } from 'primeng/table';
import { flatten, unflatten } from 'flat';

@Component({
  selector: 'jhi-task-comment',
  templateUrl: './task-comment.component.html'
})
export class TaskCommentComponent implements OnInit, OnDestroy, AfterViewInit {
  taskComments: ITaskComment[];
  eventSubscriber: Subscription;
  taskOptions: ITask[];

  totalItems: number;
  itemsPerPage: number;
  loading: boolean;

  @ViewChild('taskCommentTable', { static: false })
  taskCommentTable: Table;

  constructor(
    protected taskCommentService: TaskCommentService,
    protected taskService: TaskService,
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
    this.registerChangeInTaskComments();
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
        Object.assign(this.taskCommentTable, event);
        if (event.filters && event.filters.id) {
          this.taskCommentTable.filters.id.value = +event.filters.id.value;
        }
        if (event.filters && event.filters.taskId && event.filters.taskId.value) {
          this.taskCommentTable.filters.taskId.value = event.filters.taskId.value.map(x => +x);
        }
      });

    lazyLoadEvent$
      .pipe(
        map(event => lazyLoadEventToQueryParams(event || {})),
        tap(() => (this.loading = true)),
        switchMap(params => this.taskCommentService.query(params)),
        filter((res: HttpResponse<ITaskComment[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<ITaskComment[]>) => {
          this.paginateTaskComments(res.body, res.headers);
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
    this.router.navigate(['/task-comment'], {
      queryParams
    });
  }

  delete(id: number) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.taskComment.delete.question', { id }),
      accept: () => {
        this.taskCommentService.delete(id).subscribe(() => {
          this.eventManager.broadcast({
            name: 'taskCommentListModification',
            content: 'Deleted an taskComment'
          });
        });
      }
    });
  }

  loadAllTasks() {
    this.taskService.query().subscribe(res => (this.taskOptions = res.body));
  }

  trackId(index: number, item: ITaskComment) {
    return item.id;
  }

  registerChangeInTaskComments() {
    this.eventSubscriber = this.eventManager.subscribe('taskCommentListModification', response => this.taskCommentTable.ngOnInit());
  }

  protected paginateTaskComments(data: ITaskComment[], headers: HttpHeaders) {
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.taskComments = data;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
