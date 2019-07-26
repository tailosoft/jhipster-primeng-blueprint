import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { ITaskComment } from 'app/shared/model/task-comment.model';
import { TaskCommentService } from './task-comment.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-task-comment',
  templateUrl: './task-comment.component.html'
})
export class TaskCommentComponent implements OnInit, OnDestroy {
  taskComments: ITaskComment[];
  eventSubscriber: Subscription;

  constructor(
    protected taskCommentService: TaskCommentService,
    protected taskService: TaskService,
    protected messageService: MessageService,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadAllTasks();
    this.registerChangeInTaskComments();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  loadAll() {
    this.taskCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<ITaskComment[]>) => res.ok),
        map((res: HttpResponse<ITaskComment[]>) => res.body)
      )
      .subscribe(
        (res: ITaskComment[]) => {
          this.taskComments = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
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
    this.eventSubscriber = this.eventManager.subscribe('taskCommentListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
