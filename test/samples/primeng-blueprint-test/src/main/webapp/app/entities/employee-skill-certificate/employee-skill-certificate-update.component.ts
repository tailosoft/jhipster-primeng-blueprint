import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { IEmployeeSkillCertificate, EmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from 'app/entities/certificate-type';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from 'app/entities/employee-skill';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee';

@Component({
  selector: 'jhi-employee-skill-certificate-update',
  templateUrl: './employee-skill-certificate-update.component.html'
})
export class EmployeeSkillCertificateUpdateComponent implements OnInit {
  edit: boolean;
  isSaving: boolean;
  typeOptions: ICertificateType[];
  typeFilterValue: any;
  skillOptions: IEmployeeSkill[];
  skillFilterValue: any;
  skillEmployeeOptions: IEmployee[];
  skillEmployeeFilterValue: any;

  editForm = this.fb.group({
    grade: [null, [Validators.required]],
    date: [null, [Validators.required]],
    typeId: [null, Validators.required],
    skillName: [null, Validators.required],
    skillEmployeeUsername: [null, Validators.required]
  });

  constructor(
    protected messageService: MessageService,
    protected employeeSkillCertificateService: EmployeeSkillCertificateService,
    protected certificateTypeService: CertificateTypeService,
    protected employeeSkillService: EmployeeSkillService,
    protected employeeService: EmployeeService,
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

  onSkillEmployeeLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeService
      .query(lazyLoadEventToQueryParams(event || {}))
      .subscribe(res => (this.skillEmployeeOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(employeeSkillCertificate: IEmployeeSkillCertificate) {
    if (employeeSkillCertificate.typeId && employeeSkillCertificate.skillName && employeeSkillCertificate.skillEmployeeUsername) {
      this.edit = true;
    }
    this.editForm.patchValue({
      grade: employeeSkillCertificate.grade,
      date: employeeSkillCertificate.date,
      typeId: employeeSkillCertificate.typeId,
      skillName: employeeSkillCertificate.skillName,
      skillEmployeeUsername: employeeSkillCertificate.skillEmployeeUsername
    });
    this.typeFilterValue = employeeSkillCertificate.typeId;
    this.skillFilterValue = employeeSkillCertificate.skillName;
    this.skillEmployeeFilterValue = employeeSkillCertificate.skillEmployeeUsername;
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const employeeSkillCertificate = this.createFromForm();
    if (this.edit) {
      this.subscribeToSaveResponse(this.employeeSkillCertificateService.update(employeeSkillCertificate));
    } else {
      this.subscribeToSaveResponse(this.employeeSkillCertificateService.create(employeeSkillCertificate));
    }
  }

  private createFromForm(): IEmployeeSkillCertificate {
    return {
      ...new EmployeeSkillCertificate(),
      grade: this.editForm.get(['grade']).value,
      date: this.editForm.get(['date']).value,
      typeId: this.editForm.get(['typeId']).value,
      skillName: this.editForm.get(['skillName']).value,
      skillEmployeeUsername: this.editForm.get(['skillEmployeeUsername']).value
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
