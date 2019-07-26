import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from './employee.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit, OnDestroy {
  employees: IEmployee[];
  eventSubscriber: Subscription;

  constructor(
    protected employeeService: EmployeeService,
    protected employeeSkillService: EmployeeSkillService,
    protected messageService: MessageService,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadAllSkills();
    this.registerChangeInEmployees();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  loadAll() {
    this.employeeService
      .query()
      .pipe(
        filter((res: HttpResponse<IEmployee[]>) => res.ok),
        map((res: HttpResponse<IEmployee[]>) => res.body)
      )
      .subscribe(
        (res: IEmployee[]) => {
          this.employees = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  delete(id: number) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.employee.delete.question', { id }),
      accept: () => {
        this.employeeService.delete(id).subscribe(() => {
          this.eventManager.broadcast({
            name: 'employeeListModification',
            content: 'Deleted an employee'
          });
        });
      }
    });
  }

  loadAllSkills() {
    this.employeeSkillService.query().subscribe(res => (this.skillOptions = res.body));
  }

  trackId(index: number, item: IEmployee) {
    return item.id;
  }

  registerChangeInEmployees() {
    this.eventSubscriber = this.eventManager.subscribe('employeeListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
