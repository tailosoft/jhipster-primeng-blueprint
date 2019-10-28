import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { ITask, Task, TASK_TYPE_ARRAY } from 'app/shared/model/task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html'
})
export class TaskUpdateComponent implements OnInit {
  isSaving: boolean;
  typeOptions = TASK_TYPE_ARRAY.map(s => ({ label: s.toString(), value: s }));
  attachmentFile: File;
  pictureFile: File;

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
    pictureContentType: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected messageService: MessageService,
    protected taskService: TaskService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ task }) => {
      this.updateForm(task);
    });
  }

  updateForm(task: ITask) {
    if (task) {
      this.editForm.reset({ ...task });
      if (task.attachment) {
        fetch(`data:${task.attachmentContentType};base64,${task.attachment}`)
          .then(res => res.blob())
          .then(blob => {
            this.attachmentFile = new File([blob], '', { type: task.attachmentContentType });
          });
      }
      if (task.picture) {
        fetch(`data:${task.pictureContentType};base64,${task.picture}`)
          .then(res => res.blob())
          .then(blob => {
            this.pictureFile = new File([blob], '', { type: task.pictureContentType });
          });
      }
    } else {
      this.editForm.reset({
        done: false
      });
    }
  }

  onFileSelect(event, field) {
    const file = event.files[0];
    this.dataUtils.toBase64(file, base64Data => {
      this.editForm.patchValue({
        [field]: base64Data,
        [field + 'ContentType']: file.type
      });
    });
  }

  onFileRemove(event, field) {
    this.editForm.patchValue({
      [field]: null,
      [field + 'ContentType']: null
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const task = this.editForm.value;
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>) {
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
