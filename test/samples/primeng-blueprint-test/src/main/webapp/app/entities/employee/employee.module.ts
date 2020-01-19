import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeUpdateComponent } from './employee-update.component';
import { employeeRoute } from './employee.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(employeeRoute)],
  declarations: [EmployeeComponent, EmployeeDetailComponent, EmployeeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestEmployeeModule {}
