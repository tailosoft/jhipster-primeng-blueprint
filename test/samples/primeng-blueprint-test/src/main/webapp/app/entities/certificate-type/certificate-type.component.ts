import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from './certificate-type.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-certificate-type',
  templateUrl: './certificate-type.component.html'
})
export class CertificateTypeComponent implements OnInit, OnDestroy {
  certificateTypes: ICertificateType[];
  eventSubscriber: Subscription;

  constructor(
    protected certificateTypeService: CertificateTypeService,
    protected employeeSkillCertificateService: EmployeeSkillCertificateService,
    protected messageService: MessageService,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadAllEmployeeSkillCertificates();
    this.registerChangeInCertificateTypes();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  loadAll() {
    this.certificateTypeService
      .query()
      .pipe(
        filter((res: HttpResponse<ICertificateType[]>) => res.ok),
        map((res: HttpResponse<ICertificateType[]>) => res.body)
      )
      .subscribe(
        (res: ICertificateType[]) => {
          this.certificateTypes = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  delete(id: number) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.certificateType.delete.question', { id }),
      accept: () => {
        this.certificateTypeService.delete(id).subscribe(() => {
          this.eventManager.broadcast({
            name: 'certificateTypeListModification',
            content: 'Deleted an certificateType'
          });
        });
      }
    });
  }

  loadAllEmployeeSkillCertificates() {
    this.employeeSkillCertificateService.query().subscribe(res => (this.employeeSkillCertificateOptions = res.body));
  }

  trackId(index: number, item: ICertificateType) {
    return item.id;
  }

  registerChangeInCertificateTypes() {
    this.eventSubscriber = this.eventManager.subscribe('certificateTypeListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
