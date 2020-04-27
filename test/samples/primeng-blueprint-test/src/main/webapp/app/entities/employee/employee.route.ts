import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from './employee.service';
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeUpdateComponent } from './employee-update.component';

@Injectable({ providedIn: 'root' })
export class EmployeeResolve implements Resolve<IEmployee | null> {
  constructor(private service: EmployeeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployee | null> {
    const username = route.params['username'] ? route.params['username'] : null;
    if (username) {
      return this.service.find(username).pipe(
        flatMap((employee: HttpResponse<IEmployee>) => {
          if (employee.body) {
            return of(employee.body);
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

export const employeeRoute: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'primengtestApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':username/view',
    component: EmployeeDetailComponent,
    resolve: {
      employee: EmployeeResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'primengtestApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EmployeeUpdateComponent,
    resolve: {
      employee: EmployeeResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'primengtestApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':username/edit',
    component: EmployeeUpdateComponent,
    resolve: {
      employee: EmployeeResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'primengtestApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
