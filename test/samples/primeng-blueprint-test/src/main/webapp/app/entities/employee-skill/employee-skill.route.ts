import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EmployeeSkill } from 'app/shared/model/employee-skill.model';
import { EmployeeSkillService } from './employee-skill.service';
import { EmployeeSkillComponent } from './employee-skill.component';
import { EmployeeSkillDetailComponent } from './employee-skill-detail.component';
import { EmployeeSkillUpdateComponent } from './employee-skill-update.component';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';

@Injectable({ providedIn: 'root' })
export class EmployeeSkillResolve implements Resolve<IEmployeeSkill> {
  constructor(private service: EmployeeSkillService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmployeeSkill> {
    const name = route.params['name'] ? route.params['name'] : null;
    const employeeUsername = route.params['employeeUsername'] ? route.params['employeeUsername'] : null;
    if (name && employeeUsername) {
      return this.service.find(name, employeeUsername).pipe(
        filter((response: HttpResponse<EmployeeSkill>) => response.ok),
        map((employeeSkill: HttpResponse<EmployeeSkill>) => employeeSkill.body)
      );
    }
    return of(new EmployeeSkill());
  }
}

export const employeeSkillRoute: Routes = [
  {
    path: '',
    component: EmployeeSkillComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkill.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'view',
    component: EmployeeSkillDetailComponent,
    resolve: {
      employeeSkill: EmployeeSkillResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkill.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EmployeeSkillUpdateComponent,
    resolve: {
      employeeSkill: EmployeeSkillResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkill.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'edit',
    component: EmployeeSkillUpdateComponent,
    resolve: {
      employeeSkill: EmployeeSkillResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkill.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
