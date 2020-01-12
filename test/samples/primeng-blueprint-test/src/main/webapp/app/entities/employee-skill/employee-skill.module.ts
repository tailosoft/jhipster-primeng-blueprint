import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { EmployeeSkillComponent } from './employee-skill.component';
import { EmployeeSkillDetailComponent } from './employee-skill-detail.component';
import { EmployeeSkillUpdateComponent } from './employee-skill-update.component';
import { employeeSkillRoute } from './employee-skill.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(employeeSkillRoute)],
  declarations: [EmployeeSkillComponent, EmployeeSkillDetailComponent, EmployeeSkillUpdateComponent]
})
export class PrimengtestEmployeeSkillModule {}
