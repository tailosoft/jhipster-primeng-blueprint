import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-employee-skill-certificate',
  templateUrl: './employee-skill-certificate.component.html'
})
export class EmployeeSkillCertificateComponent implements OnInit, OnDestroy {
  employeeSkillCertificates: IEmployeeSkillCertificate[];
  eventSubscriber: Subscription;

  constructor(
    protected employeeSkillCertificateService: EmployeeSkillCertificateService,
    protected certificateTypeService: CertificateTypeService,
    protected employeeSkillService: EmployeeSkillService,
    protected messageService: MessageService,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService,
    protected datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadAllTypes();
    this.loadAllSkills();
    this.registerChangeInEmployeeSkillCertificates();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  loadAll() {
    this.employeeSkillCertificateService
      .query()
      .pipe(
        filter((res: HttpResponse<IEmployeeSkillCertificate[]>) => res.ok),
        map((res: HttpResponse<IEmployeeSkillCertificate[]>) => res.body)
      )
      .subscribe(
        (res: IEmployeeSkillCertificate[]) => {
          this.employeeSkillCertificates = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  delete(id: number) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.employeeSkillCertificate.delete.question', { id }),
      accept: () => {
        this.employeeSkillCertificateService.delete(id).subscribe(() => {
          this.eventManager.broadcast({
            name: 'employeeSkillCertificateListModification',
            content: 'Deleted an employeeSkillCertificate'
          });
        });
      }
    });
  }

  loadAllTypes() {
    this.certificateTypeService.query().subscribe(res => (this.typeOptions = res.body));
  }

  loadAllSkills() {
    this.employeeSkillService.query().subscribe(res => (this.skillOptions = res.body));
  }

  trackId(index: number, item: IEmployeeSkillCertificate) {
    return item.id;
  }

  registerChangeInEmployeeSkillCertificates() {
    this.eventSubscriber = this.eventManager.subscribe('employeeSkillCertificateListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
