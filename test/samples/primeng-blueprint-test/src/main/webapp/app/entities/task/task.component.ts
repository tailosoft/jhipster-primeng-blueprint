import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { ITask, TASK_TYPE_ARRAY } from 'app/shared/model/task.model';
import { TaskService } from './task.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit, OnDestroy {
  tasks: ITask[];
  eventSubscriber: Subscription;
  typeOptions = TASK_TYPE_ARRAY.map(s => ({ label: s.toString(), value: s }));
  endDateRange: Date[];
  createdAtRange: Date[];
  modifiedAtRange: Date[];

  constructor(
    protected taskService: TaskService,
    protected messageService: MessageService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService,
    protected datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.loadAll();
    this.registerChangeInTasks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  loadAll() {
    this.taskService
      .query()
      .pipe(
        filter((res: HttpResponse<ITask[]>) => res.ok),
        map((res: HttpResponse<ITask[]>) => res.body)
      )
      .subscribe(
        (res: ITask[]) => {
          this.tasks = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  delete(id: number) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.task.delete.question', { id }),
      accept: () => {
        this.taskService.delete(id).subscribe(() => {
          this.eventManager.broadcast({
            name: 'taskListModification',
            content: 'Deleted an task'
          });
        });
      }
    });
  }

  trackId(index: number, item: ITask) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInTasks() {
    this.eventSubscriber = this.eventManager.subscribe('taskListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
