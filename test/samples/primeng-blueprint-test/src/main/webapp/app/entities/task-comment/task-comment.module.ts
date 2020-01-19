import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { TaskCommentComponent } from './task-comment.component';
import { TaskCommentDetailComponent } from './task-comment-detail.component';
import { TaskCommentUpdateComponent } from './task-comment-update.component';
import { taskCommentRoute } from './task-comment.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(taskCommentRoute)],
  declarations: [TaskCommentComponent, TaskCommentDetailComponent, TaskCommentUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestTaskCommentModule {}
