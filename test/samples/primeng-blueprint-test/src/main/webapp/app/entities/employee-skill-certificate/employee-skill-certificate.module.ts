import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { EmployeeSkillCertificateComponent } from './employee-skill-certificate.component';
import { EmployeeSkillCertificateDetailComponent } from './employee-skill-certificate-detail.component';
import { EmployeeSkillCertificateUpdateComponent } from './employee-skill-certificate-update.component';
import { employeeSkillCertificateRoute } from './employee-skill-certificate.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(employeeSkillCertificateRoute)],
  declarations: [EmployeeSkillCertificateComponent, EmployeeSkillCertificateDetailComponent, EmployeeSkillCertificateUpdateComponent]
})
export class PrimengtestEmployeeSkillCertificateModule {}
