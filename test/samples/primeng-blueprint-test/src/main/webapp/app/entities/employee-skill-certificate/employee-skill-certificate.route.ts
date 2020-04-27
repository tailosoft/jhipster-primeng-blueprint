import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { EmployeeSkillCertificateService } from './employee-skill-certificate.service';
import { EmployeeSkillCertificateComponent } from './employee-skill-certificate.component';
import { EmployeeSkillCertificateDetailComponent } from './employee-skill-certificate-detail.component';
import { EmployeeSkillCertificateUpdateComponent } from './employee-skill-certificate-update.component';

@Injectable({ providedIn: 'root' })
export class EmployeeSkillCertificateResolve implements Resolve<IEmployeeSkillCertificate | null> {
  constructor(private service: EmployeeSkillCertificateService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployeeSkillCertificate | null> {
    const typeId = route.params['typeId'] ? route.params['typeId'] : null;
    const skillName = route.params['skillName'] ? route.params['skillName'] : null;
    const skillEmployeeUsername = route.params['skillEmployeeUsername'] ? route.params['skillEmployeeUsername'] : null;
    if (typeId && skillName && skillEmployeeUsername) {
      return this.service.find(typeId, skillName, skillEmployeeUsername).pipe(
        flatMap((employeeSkillCertificate: HttpResponse<IEmployeeSkillCertificate>) => {
          if (employeeSkillCertificate.body) {
            return of(employeeSkillCertificate.body);
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

export const employeeSkillCertificateRoute: Routes = [
  {
    path: '',
    component: EmployeeSkillCertificateComponent,
    data: {
      authorities: [Authority.USER],
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
      authorities: [Authority.USER],
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
      authorities: [Authority.USER],
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
      authorities: [Authority.USER],
      pageTitle: 'primengtestApp.employeeSkillCertificate.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
