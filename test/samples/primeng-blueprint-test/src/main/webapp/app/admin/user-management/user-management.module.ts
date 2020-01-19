import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementDetailComponent } from './user-management-detail.component';
import { UserManagementUpdateComponent } from './user-management-update.component';
import { userManagementRoute } from './user-management.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(userManagementRoute)],
  declarations: [UserManagementComponent, UserManagementDetailComponent, UserManagementUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserManagementModule {}
