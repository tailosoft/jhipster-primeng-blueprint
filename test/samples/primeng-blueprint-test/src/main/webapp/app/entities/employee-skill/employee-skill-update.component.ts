import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {} from 'ng-jhipster';
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
  isSaving: boolean;
  taskOptions: ITask[];
  employeeOptions: IEmployee[];
  employeeFilterValue: any;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    level: [null, [Validators.required]],
    tasks: [],
    employeeId: [null, Validators.required]
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
    this.loadAllEmployees();
  }

  loadAllTasks() {
    this.taskService.query().subscribe(res => (this.taskOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  loadAllEmployees() {
    this.employeeService.query().subscribe(res => (this.employeeOptions = res.body), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(employeeSkill: IEmployeeSkill) {
    this.editForm.patchValue({
      id: employeeSkill.id,
      name: employeeSkill.name,
      level: employeeSkill.level,
      tasks: employeeSkill.tasks,
      employeeId: employeeSkill.employeeId
    });
    this.employeeFilterValue = employeeSkill.fullname;
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const employeeSkill = this.createFromForm();
    if (employeeSkill.id !== undefined) {
      this.subscribeToSaveResponse(this.employeeSkillService.update(employeeSkill));
    } else {
      this.subscribeToSaveResponse(this.employeeSkillService.create(employeeSkill));
    }
  }

  private createFromForm(): IEmployeeSkill {
    return {
      ...new EmployeeSkill(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      level: this.editForm.get(['level']).value,
      tasks: this.editForm.get(['tasks']).value,
      employeeId: this.editForm.get(['employeeId']).value
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

  trackTaskById(index: number, item: ITask) {
    return item.id;
  }

  trackEmployeeById(index: number, item: IEmployee) {
    return item.id;
  }
}
