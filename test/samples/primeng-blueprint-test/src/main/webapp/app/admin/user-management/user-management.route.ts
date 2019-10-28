import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AccountService, User, UserService } from 'app/core';
import { UserMgmtComponent } from './user-management.component';
import { UserMgmtDetailComponent } from './user-management-detail.component';
import { UserMgmtUpdateComponent } from './user-management-update.component';

@Injectable({ providedIn: 'root' })
export class UserResolve implements CanActivate {
  constructor(private accountService: AccountService) {}

  canActivate() {
    return this.accountService.identity().then(account => this.accountService.hasAnyAuthority(['ROLE_ADMIN']));
  }
}

@Injectable({ providedIn: 'root' })
export class UserMgmtResolve implements Resolve<User> {
  constructor(private service: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    const id = route.params['login'] ? route.params['login'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<User>) => response.ok),
        map((response: HttpResponse<User>) => response.body)
      );
    }
    return of(null);
  }
}

export const userMgmtRoute: Routes = [
  {
    path: 'user-management',
    component: UserMgmtComponent,
    data: {
      pageTitle: 'userManagement.home.title'
    }
  },
  {
    path: 'user-management/:login/view',
    component: UserMgmtDetailComponent,
    resolve: {
      user: UserMgmtResolve
    },
    data: {
      pageTitle: 'userManagement.home.title'
    }
  },
  {
    path: 'user-management/new',
    component: UserMgmtUpdateComponent,
    resolve: {
      user: UserMgmtResolve
    }
  },
  {
    path: 'user-management/:login/edit',
    component: UserMgmtUpdateComponent,
    resolve: {
      user: UserMgmtResolve
    }
  }
];
