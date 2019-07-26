import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { EmployeeSkillCertificateComponent } from './employee-skill-certificate.component';
import { EmployeeSkillCertificateDetailComponent } from './employee-skill-certificate-detail.component';
import { EmployeeSkillCertificateUpdateComponent } from './employee-skill-certificate-update.component';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

@Injectable({ providedIn: 'root' })
export class EmployeeSkillCertificateResolve implements Resolve<IEmployeeSkillCertificate> {
  constructor(private service: EmployeeSkillCertificateService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmployeeSkillCertificate> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EmployeeSkillCertificate>) => response.ok),
        map((employeeSkillCertificate: HttpResponse<EmployeeSkillCertificate>) => employeeSkillCertificate.body)
      );
    }
    return of(new EmployeeSkillCertificate());
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
    path: ':id/view',
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
    path: ':id/edit',
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
