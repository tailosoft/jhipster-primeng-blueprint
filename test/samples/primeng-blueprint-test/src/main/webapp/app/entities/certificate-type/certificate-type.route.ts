import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CertificateTypeService } from './certificate-type.service';
import { CertificateTypeComponent } from './certificate-type.component';
import { CertificateTypeDetailComponent } from './certificate-type-detail.component';
import { CertificateTypeUpdateComponent } from './certificate-type-update.component';
import { ICertificateType } from 'app/shared/model/certificate-type.model';

@Injectable({ providedIn: 'root' })
export class CertificateTypeResolve implements Resolve<ICertificateType> {
  constructor(private service: CertificateTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICertificateType> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ICertificateType>) => response.ok),
        map((certificateType: HttpResponse<ICertificateType>) => certificateType.body)
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
