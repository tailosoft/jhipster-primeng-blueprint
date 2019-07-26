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
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
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
    path: ':id/view',
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
    path: ':id/edit',
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
