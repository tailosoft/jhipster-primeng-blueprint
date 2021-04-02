import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap, switchMap } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import {
  computeFilterMatchMode,
  lazyLoadEventToServerQueryParams,
  lazyLoadEventToRouterQueryParams,
  fillTableFromQueryParams
} from 'app/shared/util/request-util';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from 'app/entities/certificate-type/certificate-type.service';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from 'app/entities/employee-skill/employee-skill.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-employee-skill-certificate',
  templateUrl: './employee-skill-certificate.component.html'
})
export class EmployeeSkillCertificateComponent implements OnInit, OnDestroy {
  employeeSkillCertificates?: IEmployeeSkillCertificate[];
  eventSubscriber?: Subscription;
  dateRange?: Date[];
  typeOptions: ICertificateType[] | null = null;
  skillOptions: IEmployeeSkill[] | null = null;
  skillEmployeeOptions: IEmployee[] | null = null;

  totalItems?: number;
  itemsPerPage!: number;
  loading!: boolean;

  private filtersDetails: { [_: string]: { matchMode?: string; flatten?: (_: any) => string; unflatten?: (_: string) => any } } = {
    grade: { matchMode: 'equals', unflatten: (x: string) => +x },
    date: { matchMode: 'between', flatten: a => a.filter((x: string) => x).join(','), unflatten: (a: string) => a.split(',') },
    typeId: { matchMode: 'in', flatten: a => a.join(','), unflatten: a => a.split(',').map(x => +x) },
    skillName: { matchMode: 'in' },
    skillEmployeeUsername: { matchMode: 'in' }
  };

  @ViewChild('employeeSkillCertificateTable', { static: true })
  employeeSkillCertificateTable!: Table;

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

  ngOnInit(): void {
    this.loadAllTypes();
    this.registerChangeInEmployeeSkillCertificates();
    this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => fillTableFromQueryParams(this.employeeSkillCertificateTable, queryParams, this.filtersDetails)),
        tap(
          () =>
            (this.dateRange =
              this.employeeSkillCertificateTable.filters.date &&
              this.employeeSkillCertificateTable.filters.date.value &&
              this.employeeSkillCertificateTable.filters.date.value.map((x: string) => new Date(x)))
        ),
        tap(() => (this.loading = true)),
        switchMap(() =>
          this.employeeSkillCertificateService.query(
            lazyLoadEventToServerQueryParams(this.employeeSkillCertificateTable.createLazyLoadMetadata())
          )
        ),
        filter((res: HttpResponse<IEmployeeSkillCertificate[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<IEmployeeSkillCertificate[]>) => {
          this.paginateEmployeeSkillCertificates(res.body!, res.headers);
          this.loading = false;
        },
        (res: HttpErrorResponse) => {
          this.onError(res.message);
          this.loading = false;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  onLazyLoadEvent(event: LazyLoadEvent): void {
    const queryParams = lazyLoadEventToRouterQueryParams(event, this.filtersDetails);
    this.router.navigate(['/employee-skill-certificate'], { queryParams });
  }

  filter(value: any, field: string): void {
    this.employeeSkillCertificateTable.filter(value, field, computeFilterMatchMode(this.filtersDetails[field]));
  }

  delete(typeId: number, skillName: string, skillEmployeeUsername: string): void {
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

  loadAllTypes(): void {
    this.certificateTypeService.query().subscribe(res => (this.typeOptions = res.body));
  }

  onSkillLazyLoadEvent(event: LazyLoadEvent): void {
    this.employeeSkillService
      .query(lazyLoadEventToServerQueryParams(event, 'name.contains'))
      .subscribe(res => (this.skillOptions = res.body));
  }

  onSkillEmployeeLazyLoadEvent(event: LazyLoadEvent): void {
    this.employeeService
      .query(lazyLoadEventToServerQueryParams(event, 'fullname.contains'))
      .subscribe(res => (this.skillEmployeeOptions = res.body));
  }

  trackId(index: number, item: IEmployeeSkillCertificate): string {
    return '' + item.typeId + ',' + item.skillName + ',' + item.skillEmployeeUsername;
  }

  registerChangeInEmployeeSkillCertificates(): void {
    this.eventSubscriber = this.eventManager.subscribe('employeeSkillCertificateListModification', () =>
      this.router.navigate(['/employee-skill-certificate'], { queryParams: { r: Date.now() } })
    );
  }

  protected paginateEmployeeSkillCertificates(data: IEmployeeSkillCertificate[], headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.employeeSkillCertificates = data;
  }

  protected onError(errorMessage: string): void {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }

  onDateSelect(dateRange: Date[] | undefined, column: string, time = false): void {
    const dateToString = time ? (x: Date) => x && x.toISOString() : (x: Date) => x && this.datePipe.transform(x, 'yyyy-MM-dd');
    if (dateRange) {
      this.filter(dateRange.map(dateToString), column);
    } else {
      this.filter(undefined, column);
    }
  }
}
