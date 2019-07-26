import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

@Component({
  selector: 'jhi-employee-skill-certificate-detail',
  templateUrl: './employee-skill-certificate-detail.component.html'
})
export class EmployeeSkillCertificateDetailComponent implements OnInit {
  employeeSkillCertificate: IEmployeeSkillCertificate;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ employeeSkillCertificate }) => {
      this.employeeSkillCertificate = employeeSkillCertificate;
    });
  }

  previousState() {
    window.history.back();
  }
}
