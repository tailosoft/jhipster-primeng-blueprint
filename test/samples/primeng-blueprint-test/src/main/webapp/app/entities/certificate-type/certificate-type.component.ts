import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from './certificate-type.service';
import { computeFilterMatchMode } from 'app/shared/util/request-util';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'jhi-certificate-type',
  templateUrl: './certificate-type.component.html'
})
export class CertificateTypeComponent implements OnInit, OnDestroy {
  certificateTypes?: ICertificateType[];
  eventSubscriber?: Subscription;

  private filtersDetails: { [_: string]: { matchMode?: string; flatten?: (_: any) => string; unflatten?: (_: string) => any } } = {
    id: { matchMode: 'equals', unflatten: (x: string) => +x }
  };

  @ViewChild('certificateTypeTable', { static: true })
  certificateTypeTable!: Table;

  constructor(
    protected certificateTypeService: CertificateTypeService,
    protected messageService: MessageService,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCertificateTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  loadAll(): void {
    this.certificateTypeService
      .query()
      .pipe(
        filter((res: HttpResponse<ICertificateType[]>) => res.ok),
        map((res: HttpResponse<ICertificateType[]>) => res.body!)
      )
      .subscribe(
        (certificateTypes: ICertificateType[]) => {
          this.certificateTypes = certificateTypes;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  filter(value: any, field: string): void {
    this.certificateTypeTable.filter(value, field, computeFilterMatchMode(this.filtersDetails[field]));
  }

  delete(id: number): void {
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

  trackId(index: number, item: ICertificateType): string {
    return '' + item.id;
  }

  registerChangeInCertificateTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('certificateTypeListModification', () => this.loadAll());
  }

  protected onError(errorMessage: string): void {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
