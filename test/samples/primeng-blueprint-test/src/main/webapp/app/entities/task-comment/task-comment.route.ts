import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TaskCommentService } from './task-comment.service';
import { TaskCommentComponent } from './task-comment.component';
import { TaskCommentDetailComponent } from './task-comment-detail.component';
import { TaskCommentUpdateComponent } from './task-comment-update.component';
import { ITaskComment } from 'app/shared/model/task-comment.model';

@Injectable({ providedIn: 'root' })
export class TaskCommentResolve implements Resolve<ITaskComment> {
  constructor(private service: TaskCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITaskComment> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ITaskComment>) => response.ok),
        map((taskComment: HttpResponse<ITaskComment>) => taskComment.body)
      );
    }
    return of(null);
  }
}

export const taskCommentRoute: Routes = [
  {
    path: '',
    component: TaskCommentComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.taskComment.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TaskCommentDetailComponent,
    resolve: {
      taskComment: TaskCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.taskComment.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TaskCommentUpdateComponent,
    resolve: {
      taskComment: TaskCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.taskComment.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TaskCommentUpdateComponent,
    resolve: {
      taskComment: TaskCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.taskComment.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
