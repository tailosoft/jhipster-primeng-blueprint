import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITaskComment } from 'app/shared/model/task-comment.model';
import { TaskCommentService } from './task-comment.service';
import { TaskCommentComponent } from './task-comment.component';
import { TaskCommentDetailComponent } from './task-comment-detail.component';
import { TaskCommentUpdateComponent } from './task-comment-update.component';

@Injectable({ providedIn: 'root' })
export class TaskCommentResolve implements Resolve<ITaskComment | null> {
  constructor(private service: TaskCommentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITaskComment | null> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((taskComment: HttpResponse<ITaskComment>) => {
          if (taskComment.body) {
            return of(taskComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
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
