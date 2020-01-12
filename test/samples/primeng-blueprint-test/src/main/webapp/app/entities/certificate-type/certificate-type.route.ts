import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICertificateType } from 'app/shared/model/certificate-type.model';
import { CertificateTypeService } from './certificate-type.service';
import { CertificateTypeComponent } from './certificate-type.component';
import { CertificateTypeDetailComponent } from './certificate-type-detail.component';
import { CertificateTypeUpdateComponent } from './certificate-type-update.component';

@Injectable({ providedIn: 'root' })
export class CertificateTypeResolve implements Resolve<ICertificateType | null> {
  constructor(private service: CertificateTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICertificateType | null> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((certificateType: HttpResponse<ICertificateType>) => {
          if (certificateType.body) {
            return of(certificateType.body);
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

export const certificateTypeRoute: Routes = [
  {
    path: '',
    component: CertificateTypeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.certificateType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CertificateTypeDetailComponent,
    resolve: {
      certificateType: CertificateTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.certificateType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CertificateTypeUpdateComponent,
    resolve: {
      certificateType: CertificateTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.certificateType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CertificateTypeUpdateComponent,
    resolve: {
      certificateType: CertificateTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.certificateType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
