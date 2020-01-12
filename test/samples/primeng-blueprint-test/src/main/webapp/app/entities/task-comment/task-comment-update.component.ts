import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ITaskComment } from 'app/shared/model/task-comment.model';
import { TaskCommentService } from './task-comment.service';
import { MessageService } from 'primeng/api';
import { ITask } from 'app/shared/model/task.model';
import { TaskService } from 'app/entities/task/task.service';

@Component({
  selector: 'jhi-task-comment-update',
  templateUrl: './task-comment-update.component.html'
})
export class TaskCommentUpdateComponent implements OnInit {
  isSaving = false;
  taskOptions: ITask[] | null = null;
  taskFilterValue?: any;

  editForm = this.fb.group({
    id: [],
    value: [null, [Validators.required]],
    taskId: [null, Validators.required]
  });

  constructor(
    protected messageService: MessageService,
    protected taskCommentService: TaskCommentService,
    protected taskService: TaskService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ taskComment }) => {
      this.updateForm(taskComment);
    });
    this.loadAllTasks();
  }

  loadAllTasks(): void {
    this.taskService.query().subscribe(
      (res: HttpResponse<ITask[]>) => (this.taskOptions = res.body),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  updateForm(taskComment: ITaskComment | null): void {
    if (taskComment) {
      this.editForm.reset({ ...taskComment });
      this.taskFilterValue = taskComment.taskId;
    } else {
      this.editForm.reset({});
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const taskComment = this.editForm.value;
    if (taskComment.id !== null) {
      this.subscribeToSaveResponse(this.taskCommentService.update(taskComment));
    } else {
      this.subscribeToSaveResponse(this.taskCommentService.create(taskComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskComment>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
  protected onError(errorMessage: string): void {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
