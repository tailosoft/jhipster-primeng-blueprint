import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { lazyLoadEventToServerQueryParams } from 'app/shared/util/request-util';
import { LazyLoadEvent } from 'primeng/api';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { MessageService } from 'primeng/api';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from 'app/entities/certificate-type/certificate-type.service';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from 'app/entities/employee-skill/employee-skill.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';

@Component({
  selector: 'jhi-employee-skill-certificate-update',
  templateUrl: './employee-skill-certificate-update.component.html'
})
export class EmployeeSkillCertificateUpdateComponent implements OnInit {
  edit = false;
  isSaving = false;
  typeOptions: ICertificateType[] | null = null;
  typeFilterValue?: any;
  skillOptions: IEmployeeSkill[] | null = null;
  skillFilterValue?: any;
  skillEmployeeOptions: IEmployee[] | null = null;
  skillEmployeeFilterValue?: any;

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

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ employeeSkillCertificate }) => {
      this.updateForm(employeeSkillCertificate);
    });
    this.loadAllTypes();
  }

  loadAllTypes(): void {
    this.certificateTypeService.query().subscribe(
      (res: HttpResponse<ICertificateType[]>) => (this.typeOptions = res.body),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  onSkillLazyLoadEvent(event: LazyLoadEvent): void {
    this.employeeSkillService.query(lazyLoadEventToServerQueryParams(event, 'name.contains')).subscribe(
      (res: HttpResponse<IEmployeeSkill[]>) => (this.skillOptions = res.body),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  onSkillEmployeeLazyLoadEvent(event: LazyLoadEvent): void {
    this.employeeService.query(lazyLoadEventToServerQueryParams(event, 'fullname.contains')).subscribe(
      (res: HttpResponse<IEmployee[]>) => (this.skillEmployeeOptions = res.body),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  updateForm(employeeSkillCertificate: IEmployeeSkillCertificate | null): void {
    if (employeeSkillCertificate) {
      this.edit = true;
      this.editForm.reset({ ...employeeSkillCertificate });
      this.typeFilterValue = employeeSkillCertificate.typeId;
      this.skillFilterValue = employeeSkillCertificate.skillName;
      this.skillEmployeeFilterValue = employeeSkillCertificate.skillEmployeeUsername;
    } else {
      this.editForm.reset({});
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employeeSkillCertificate = this.editForm.value;
    if (this.edit) {
      this.subscribeToSaveResponse(this.employeeSkillCertificateService.update(employeeSkillCertificate));
    } else {
      this.subscribeToSaveResponse(this.employeeSkillCertificateService.create(employeeSkillCertificate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeSkillCertificate>>): void {
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
