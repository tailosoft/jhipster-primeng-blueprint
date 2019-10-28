import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ITaskComment, TaskComment } from 'app/shared/model/task-comment.model';
import { TaskCommentService } from './task-comment.service';
import { ITask } from 'app/shared/model/task.model';
import { TaskService } from 'app/entities/task';

@Component({
  selector: 'jhi-task-comment-update',
  templateUrl: './task-comment-update.component.html'
})
export class TaskCommentUpdateComponent implements OnInit {
  isSaving: boolean;
  taskOptions: ITask[];
  taskFilterValue: any;

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

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ taskComment }) => {
      this.updateForm(taskComment);
    });
    this.loadAllTasks();
  }

  loadAllTasks() {
    this.taskService.query().subscribe(res => (this.taskOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(taskComment: ITaskComment) {
    if (taskComment) {
      this.editForm.reset({ ...taskComment });
      this.taskFilterValue = taskComment.taskId;
    } else {
      this.editForm.reset({});
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const taskComment = this.editForm.value;
    if (taskComment.id !== null) {
      this.subscribeToSaveResponse(this.taskCommentService.update(taskComment));
    } else {
      this.subscribeToSaveResponse(this.taskCommentService.create(taskComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskComment>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
