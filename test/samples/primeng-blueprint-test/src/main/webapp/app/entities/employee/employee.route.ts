import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Employee } from 'app/shared/model/employee.model';
import { EmployeeService } from './employee.service';
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeUpdateComponent } from './employee-update.component';
import { IEmployee } from 'app/shared/model/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeResolve implements Resolve<IEmployee> {
  constructor(private service: EmployeeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmployee> {
    const username = route.params['username'] ? route.params['username'] : null;
    if (username) {
      return this.service.find(username).pipe(
        filter((response: HttpResponse<Employee>) => response.ok),
        map((employee: HttpResponse<Employee>) => employee.body)
      );
    }
    return of(new Employee());
  }
}

export const employeeRoute: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    data: {
      authorities: ['ROLE_USER'],
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
      authorities: ['ROLE_USER'],
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
      authorities: ['ROLE_USER'],
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
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
