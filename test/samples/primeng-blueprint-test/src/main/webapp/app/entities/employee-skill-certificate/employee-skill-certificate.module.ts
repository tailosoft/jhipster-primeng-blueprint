import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { EmployeeSkillCertificateComponent } from './employee-skill-certificate.component';
import { EmployeeSkillCertificateDetailComponent } from './employee-skill-certificate-detail.component';
import { EmployeeSkillCertificateUpdateComponent } from './employee-skill-certificate-update.component';
import { employeeSkillCertificateRoute } from './employee-skill-certificate.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(employeeSkillCertificateRoute)],
  declarations: [EmployeeSkillCertificateComponent, EmployeeSkillCertificateDetailComponent, EmployeeSkillCertificateUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestEmployeeSkillCertificateModule {}
