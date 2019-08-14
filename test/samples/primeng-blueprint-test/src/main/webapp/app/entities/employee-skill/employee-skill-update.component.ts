import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { lazyLoadEventToQueryParams } from 'app/shared/util/request-util';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { IEmployeeSkill, EmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from './employee-skill.service';
import { ITask } from 'app/shared/model/task.model';
import { TaskService } from 'app/entities/task';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee';

@Component({
  selector: 'jhi-employee-skill-update',
  templateUrl: './employee-skill-update.component.html'
})
export class EmployeeSkillUpdateComponent implements OnInit {
  edit: boolean;
  isSaving: boolean;
  taskOptions: ITask[];
  employeeOptions: IEmployee[];
  employeeFilterValue: any;
  teacherOptions: IEmployee[];
  teacherFilterValue: any;

  editForm = this.fb.group({
    name: [null, [Validators.required]],
    level: [null, [Validators.required]],
    tasks: [],
    employeeUsername: [null, Validators.required],
    teacherUsername: [null, Validators.required]
  });

  constructor(
    protected messageService: MessageService,
    protected employeeSkillService: EmployeeSkillService,
    protected taskService: TaskService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ employeeSkill }) => {
      this.updateForm(employeeSkill);
    });
    this.loadAllTasks();
  }

  loadAllTasks() {
    this.taskService.query().subscribe(res => (this.taskOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  onEmployeeLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeService
      .query(lazyLoadEventToQueryParams(event || {}, 'fullname.contains'))
      .subscribe(res => (this.employeeOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  onTeacherLazyLoadEvent(event: LazyLoadEvent) {
    this.employeeService
      .query(lazyLoadEventToQueryParams(event || {}, 'fullname.contains'))
      .subscribe(res => (this.teacherOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(employeeSkill: IEmployeeSkill) {
    if (employeeSkill.name && employeeSkill.employeeUsername) {
      this.edit = true;
    }
    this.editForm.patchValue({
      name: employeeSkill.name,
      level: employeeSkill.level,
      tasks: employeeSkill.tasks,
      employeeUsername: employeeSkill.employeeUsername,
      teacherUsername: employeeSkill.teacherUsername
    });
    this.employeeFilterValue = employeeSkill.employeeUsername;
    this.teacherFilterValue = employeeSkill.teacherUsername;
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const employeeSkill = this.createFromForm();
    if (this.edit) {
      this.subscribeToSaveResponse(this.employeeSkillService.update(employeeSkill));
    } else {
      this.subscribeToSaveResponse(this.employeeSkillService.create(employeeSkill));
    }
  }

  private createFromForm(): IEmployeeSkill {
    return {
      ...new EmployeeSkill(),
      name: this.editForm.get(['name']).value,
      level: this.editForm.get(['level']).value,
      tasks: this.editForm.get(['tasks']).value,
      employeeUsername: this.editForm.get(['employeeUsername']).value,
      teacherUsername: this.editForm.get(['teacherUsername']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeSkill>>) {
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
