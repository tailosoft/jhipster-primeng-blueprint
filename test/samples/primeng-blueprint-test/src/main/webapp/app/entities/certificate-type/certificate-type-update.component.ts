import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICertificateType, CertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from './certificate-type.service';

@Component({
  selector: 'jhi-certificate-type-update',
  templateUrl: './certificate-type-update.component.html'
})
export class CertificateTypeUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]]
  });

  constructor(
    protected certificateTypeService: CertificateTypeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ certificateType }) => {
      this.updateForm(certificateType);
    });
  }

  updateForm(certificateType: ICertificateType) {
    if (certificateType) {
      this.editForm.reset({ ...certificateType });
    } else {
      this.editForm.reset({});
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const certificateType = this.editForm.value;
    if (certificateType.id !== null) {
      this.subscribeToSaveResponse(this.certificateTypeService.update(certificateType));
    } else {
      this.subscribeToSaveResponse(this.certificateTypeService.create(certificateType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificateType>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
