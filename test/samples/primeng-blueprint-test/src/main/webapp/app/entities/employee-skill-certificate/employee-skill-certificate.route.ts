import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { EmployeeSkillCertificateComponent } from './employee-skill-certificate.component';
import { EmployeeSkillCertificateDetailComponent } from './employee-skill-certificate-detail.component';
import { EmployeeSkillCertificateUpdateComponent } from './employee-skill-certificate-update.component';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

@Injectable({ providedIn: 'root' })
export class EmployeeSkillCertificateResolve implements Resolve<IEmployeeSkillCertificate> {
  constructor(private service: EmployeeSkillCertificateService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmployeeSkillCertificate> {
    const typeId = route.params['typeId'] ? route.params['typeId'] : null;
    const skillName = route.params['skillName'] ? route.params['skillName'] : null;
    const skillEmployeeUsername = route.params['skillEmployeeUsername'] ? route.params['skillEmployeeUsername'] : null;
    if (typeId && skillName && skillEmployeeUsername) {
      return this.service.find(typeId, skillName, skillEmployeeUsername).pipe(
        filter((response: HttpResponse<IEmployeeSkillCertificate>) => response.ok),
        map((employeeSkillCertificate: HttpResponse<IEmployeeSkillCertificate>) => employeeSkillCertificate.body)
      );
    }
    return of(null);
  }
}

export const employeeSkillCertificateRoute: Routes = [
  {
    path: '',
    component: EmployeeSkillCertificateComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkillCertificate.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'view',
    component: EmployeeSkillCertificateDetailComponent,
    resolve: {
      employeeSkillCertificate: EmployeeSkillCertificateResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkillCertificate.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EmployeeSkillCertificateUpdateComponent,
    resolve: {
      employeeSkillCertificate: EmployeeSkillCertificateResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkillCertificate.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'edit',
    component: EmployeeSkillCertificateUpdateComponent,
    resolve: {
      employeeSkillCertificate: EmployeeSkillCertificateResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.employeeSkillCertificate.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
