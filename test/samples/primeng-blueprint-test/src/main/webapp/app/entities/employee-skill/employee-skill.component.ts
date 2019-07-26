import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from './employee-skill.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-employee-skill',
  templateUrl: './employee-skill.component.html'
})
export class EmployeeSkillComponent implements OnInit, OnDestroy {
  employeeSkills: IEmployeeSkill[];
  eventSubscriber: Subscription;

  constructor(
    protected employeeSkillService: EmployeeSkillService,
    protected employeeSkillCertificateService: EmployeeSkillCertificateService,
    protected taskService: TaskService,
    protected employeeService: EmployeeService,
    protected messageService: MessageService,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadAllEmployeeSkillCertificates();
    this.loadAllTasks();
    this.loadAllEmployees();
    this.registerChangeInEmployeeSkills();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  loadAll() {
    this.employeeSkillService
      .query()
      .pipe(
        filter((res: HttpResponse<IEmployeeSkill[]>) => res.ok),
        map((res: HttpResponse<IEmployeeSkill[]>) => res.body)
      )
      .subscribe(
        (res: IEmployeeSkill[]) => {
          this.employeeSkills = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  delete(id: number) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.employeeSkill.delete.question', { id }),
      accept: () => {
        this.employeeSkillService.delete(id).subscribe(() => {
          this.eventManager.broadcast({
            name: 'employeeSkillListModification',
            content: 'Deleted an employeeSkill'
          });
        });
      }
    });
  }

  loadAllEmployeeSkillCertificates() {
    this.employeeSkillCertificateService.query().subscribe(res => (this.employeeSkillCertificateOptions = res.body));
  }

  loadAllTasks() {
    this.taskService.query().subscribe(res => (this.taskOptions = res.body));
  }

  loadAllEmployees() {
    this.employeeService.query().subscribe(res => (this.employeeOptions = res.body));
  }

  trackId(index: number, item: IEmployeeSkill) {
    return item.id;
  }

  registerChangeInEmployeeSkills() {
    this.eventSubscriber = this.eventManager.subscribe('employeeSkillListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
