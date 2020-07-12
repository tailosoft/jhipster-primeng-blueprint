import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { lazyLoadEventToServerQueryParams } from 'app/shared/util/request-util';
import { LazyLoadEvent } from 'primeng/api';
import { JhiDataUtils } from 'ng-jhipster';
import { ITask } from 'app/shared/model/task.model';
import { TaskType, TASK_TYPE_ARRAY } from 'app/shared/model/enumerations/task-type.model';
import { TaskService } from './task.service';
import { MessageService } from 'primeng/api';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html'
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  userOptions: IUser[] | null = null;
  userFilterValue?: any;
  typeOptions = TASK_TYPE_ARRAY.map((s: TaskType) => ({ label: s.toString(), value: s }));
  attachmentFile?: File;
  pictureFile?: File;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    type: [null, [Validators.required]],
    endDate: [],
    createdAt: [null, [Validators.required]],
    modifiedAt: [null, [Validators.required]],
    done: [null, [Validators.required]],
    description: [null, [Validators.required]],
    attachment: [null, [Validators.required]],
    attachmentContentType: [],
    picture: [null, [Validators.required]],
    pictureContentType: [],
    userId: [null, Validators.required]
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected messageService: MessageService,
    protected taskService: TaskService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ task }) => {
      this.updateForm(task);
    });
  }

  onUserLazyLoadEvent(event: LazyLoadEvent): void {
    this.userService.query(lazyLoadEventToServerQueryParams(event, 'login.contains')).subscribe(
      (res: HttpResponse<IUser[]>) => (this.userOptions = res.body),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  updateForm(task: ITask | null): void {
    if (task) {
      this.editForm.reset({ ...task });
      if (task.attachment) {
        fetch(`data:${task.attachmentContentType};base64,${task.attachment}`)
          .then((res: any) => res.blob())
          .then(blob => {
            this.attachmentFile = new File([blob], '', { type: task.attachmentContentType });
          });
      }
      if (task.picture) {
        fetch(`data:${task.pictureContentType};base64,${task.picture}`)
          .then((res: any) => res.blob())
          .then(blob => {
            this.pictureFile = new File([blob], '', { type: task.pictureContentType });
          });
      }
      this.userFilterValue = task.userId;
    } else {
      this.editForm.reset({
        endDate: new Date(),
        createdAt: new Date(),
        modifiedAt: new Date(),
        done: false
      });
    }
  }

  onFileSelect(event: { event: Event; files: File[] }, field: string): void {
    const file = event.files[0];
    this.dataUtils.toBase64(file, (base64Data: string) => {
      this.editForm.patchValue({
        [field]: base64Data,
        [field + 'ContentType']: file.type
      });
    });
  }

  onFileRemove(event: { event: Event; files: File[] }, field: string): void {
    this.editForm.patchValue({
      [field]: null,
      [field + 'ContentType']: null
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.editForm.value;
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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
