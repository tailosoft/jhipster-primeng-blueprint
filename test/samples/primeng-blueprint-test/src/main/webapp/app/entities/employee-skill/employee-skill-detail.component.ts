import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';

@Component({
  selector: 'jhi-employee-skill-detail',
  templateUrl: './employee-skill-detail.component.html'
})
export class EmployeeSkillDetailComponent implements OnInit {
  employeeSkill: IEmployeeSkill | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employeeSkill }) => {
      this.employeeSkill = employeeSkill;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
