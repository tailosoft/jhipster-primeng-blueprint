import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { LazyLoadEvent } from 'primeng/api';
import {} from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployeeSkillCertificate, EmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from 'app/entities/certificate-type';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from 'app/entities/employee-skill';

@Component({
  selector: 'jhi-employee-skill-certificate-update',
  templateUrl: './employee-skill-certificate-update.component.html'
})
export class EmployeeSkillCertificateUpdateComponent implements OnInit {
  isSaving: boolean;
  typeOptions: ICertificateType[];
  typeFilterValue: any;
  skillOptions: IEmployeeSkill[];
  skillFilterValue: any;

  editForm = this.fb.group({
    id: [],
    grade: [null, [Validators.required]],
    date: [null, [Validators.required]],
    typeId: [null, Validators.required],
    skillId: [null, Validators.required]
  });

  constructor(
    protected messageService: MessageService,
    protected employeeSkillCertificateService: EmployeeSkillCertificateService,
    protected certificateTypeService: CertificateTypeService,
    protected employeeSkillService: EmployeeSkillService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ employeeSkillCertificate }) => {
      this.updateForm(employeeSkillCertificate);
    });
    this.loadAllTypes();
  }

  loadAllTypes() {
    this.certificateTypeService
      .query()
      .subscribe(res => (this.typeOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  onSkillLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeSkillService
      .query(lazyLoadEventToQueryParams(event || {}))
      .subscribe(res => (this.skillOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(employeeSkillCertificate: IEmployeeSkillCertificate) {
    this.editForm.patchValue({
      id: employeeSkillCertificate.id,
      grade: employeeSkillCertificate.grade,
      date: employeeSkillCertificate.date,
      typeId: employeeSkillCertificate.typeId,
      skillId: employeeSkillCertificate.skillId
    });
    this.typeFilterValue = employeeSkillCertificate.typeId;
    this.skillFilterValue = employeeSkillCertificate.skillId;
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const employeeSkillCertificate = this.createFromForm();
    if (employeeSkillCertificate.id !== undefined) {
      this.subscribeToSaveResponse(this.employeeSkillCertificateService.update(employeeSkillCertificate));
    } else {
      this.subscribeToSaveResponse(this.employeeSkillCertificateService.create(employeeSkillCertificate));
    }
  }

  private createFromForm(): IEmployeeSkillCertificate {
    return {
      ...new EmployeeSkillCertificate(),
      id: this.editForm.get(['id']).value,
      grade: this.editForm.get(['grade']).value,
      date: this.editForm.get(['date']).value,
      typeId: this.editForm.get(['typeId']).value,
      skillId: this.editForm.get(['skillId']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeSkillCertificate>>) {
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
