import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, tap, take, debounceTime, switchMap } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

import { ITEMS_PER_PAGE } from 'app/shared';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from 'app/entities/certificate-type';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from 'app/entities/employee-skill';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee';

import { Table } from 'primeng/table';
import { flatten, unflatten } from 'flat';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-employee-skill-certificate',
  templateUrl: './employee-skill-certificate.component.html'
})
export class EmployeeSkillCertificateComponent implements OnInit, OnDestroy, AfterViewInit {
  employeeSkillCertificates: IEmployeeSkillCertificate[];
  eventSubscriber: Subscription;
  dateRange: Date[];
  typeOptions: ICertificateType[];
  skillOptions: IEmployeeSkill[];
  skillEmployeeOptions: IEmployee[];

  totalItems: number;
  itemsPerPage: number;
  loading: boolean;

  @ViewChild('employeeSkillCertificateTable', { static: false })
  employeeSkillCertificateTable: Table;

  constructor(
    protected employeeSkillCertificateService: EmployeeSkillCertificateService,
    protected certificateTypeService: CertificateTypeService,
    protected employeeSkillService: EmployeeSkillService,
    protected employeeService: EmployeeService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService,
    protected datePipe: DatePipe
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.loading = true;
  }

  ngOnInit() {
    this.loadAllTypes();
    this.registerChangeInEmployeeSkillCertificates();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  ngAfterViewInit() {
    const lazyLoadEvent$ = this.activatedRoute.queryParams.pipe(
      debounceTime(300),
      map(data => <LazyLoadEvent>(<any>unflatten(data)).lle)
    );

    lazyLoadEvent$
      .pipe(
        take(1),
        filter(event => event !== undefined)
      )
      .subscribe(event => {
        Object.assign(this.employeeSkillCertificateTable, event);
        if (event.filters && event.filters.grade) {
          this.employeeSkillCertificateTable.filters.grade.value = +event.filters.grade.value;
        }
        this.dateRange = event.filters && event.filters.date && event.filters.date.value && event.filters.date.value.map(x => new Date(x));
        if (event.filters && event.filters.typeId && event.filters.typeId.value) {
          this.employeeSkillCertificateTable.filters.typeId.value = event.filters.typeId.value.map(x => +x);
        }
        if (event.filters && event.filters.skillName && event.filters.skillName.value) {
          this.employeeSkillCertificateTable.filters.skillName.value = event.filters.skillName.value.map(x => +x);
        }
        if (event.filters && event.filters.skillEmployeeUsername && event.filters.skillEmployeeUsername.value) {
          this.employeeSkillCertificateTable.filters.skillEmployeeUsername.value = event.filters.skillEmployeeUsername.value.map(x => +x);
        }
      });

    lazyLoadEvent$
      .pipe(
        map(event => lazyLoadEventToQueryParams(event || {})),
        tap(() => (this.loading = true)),
        switchMap(params => this.employeeSkillCertificateService.query(params)),
        filter((res: HttpResponse<IEmployeeSkillCertificate[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<IEmployeeSkillCertificate[]>) => {
          this.paginateEmployeeSkillCertificates(res.body, res.headers);
          this.loading = false;
        },
        (res: HttpErrorResponse) => {
          this.onError(res.message);
          this.loading = false;
        }
      );
  }

  onLazyLoadEvent(event: LazyLoadEvent) {
    const queryParams = flatten({ lle: event });
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && typeof value === 'object' && Object.entries(value).length === 0) {
        delete queryParams[key];
      }
    });
    this.router.navigate(['/employee-skill-certificate'], {
      queryParams
    });
  }

  delete(typeId: number, skillName: string, skillEmployeeUsername: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.employeeSkillCertificate.delete.question', {
        id: typeId + ',' + skillName + ',' + skillEmployeeUsername
      }),
      accept: () => {
        this.employeeSkillCertificateService.delete(typeId, skillName, skillEmployeeUsername).subscribe(() => {
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

  onSkillLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeSkillService.query(lazyLoadEventToQueryParams(event || {})).subscribe(res => (this.skillOptions = res.body));
  }

  onSkillEmployeeLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeService.query(lazyLoadEventToQueryParams(event || {})).subscribe(res => (this.skillEmployeeOptions = res.body));
  }

  trackId(index: number, item: IEmployeeSkillCertificate) {
    return item.typeId + ',' + item.skillName + ',' + item.skillEmployeeUsername;
  }

  registerChangeInEmployeeSkillCertificates() {
    this.eventSubscriber = this.eventManager.subscribe('employeeSkillCertificateListModification', response =>
      this.employeeSkillCertificateTable.ngOnInit()
    );
  }

  protected paginateEmployeeSkillCertificates(data: IEmployeeSkillCertificate[], headers: HttpHeaders) {
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.employeeSkillCertificates = data;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }

  onDateSelect(dateRange: Date[], column: string, time = false) {
    const dateToString = time ? x => x && x.toISOString() : x => x && this.datePipe.transform(x, 'yyyy-MM-dd');
    if (dateRange) {
      this.employeeSkillCertificateTable.filter(dateRange.map(dateToString), column, 'between');
    } else {
      this.employeeSkillCertificateTable.filter(undefined, column, undefined);
    }
  }
}
