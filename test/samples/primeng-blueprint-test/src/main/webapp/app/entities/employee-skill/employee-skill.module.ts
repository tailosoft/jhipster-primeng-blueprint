import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { EmployeeSkillComponent } from './employee-skill.component';
import { EmployeeSkillDetailComponent } from './employee-skill-detail.component';
import { EmployeeSkillUpdateComponent } from './employee-skill-update.component';
import { employeeSkillRoute } from './employee-skill.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(employeeSkillRoute)],
  declarations: [EmployeeSkillComponent, EmployeeSkillDetailComponent, EmployeeSkillUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestEmployeeSkillModule {}
