import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployee } from 'app/shared/model/employee.model';

@Component({
  selector: 'jhi-employee-detail',
  templateUrl: './employee-detail.component.html'
})
export class EmployeeDetailComponent implements OnInit {
  employee: IEmployee;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
    });
  }

  previousState() {
    window.history.back();
  }
}
