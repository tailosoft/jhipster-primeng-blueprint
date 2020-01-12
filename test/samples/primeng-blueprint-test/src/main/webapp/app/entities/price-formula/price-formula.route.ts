import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPriceFormula } from 'app/shared/model/price-formula.model';
import { PriceFormulaService } from './price-formula.service';
import { PriceFormulaComponent } from './price-formula.component';
import { PriceFormulaDetailComponent } from './price-formula-detail.component';
import { PriceFormulaUpdateComponent } from './price-formula-update.component';

@Injectable({ providedIn: 'root' })
export class PriceFormulaResolve implements Resolve<IPriceFormula | null> {
  constructor(private service: PriceFormulaService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPriceFormula | null> {
    const max = route.params['max'] ? route.params['max'] : null;
    if (max) {
      return this.service.find(max).pipe(
        flatMap((priceFormula: HttpResponse<IPriceFormula>) => {
          if (priceFormula.body) {
            return of(priceFormula.body);
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

export const priceFormulaRoute: Routes = [
  {
    path: '',
    component: PriceFormulaComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.priceFormula.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':max/view',
    component: PriceFormulaDetailComponent,
    resolve: {
      priceFormula: PriceFormulaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.priceFormula.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PriceFormulaUpdateComponent,
    resolve: {
      priceFormula: PriceFormulaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.priceFormula.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':max/edit',
    component: PriceFormulaUpdateComponent,
    resolve: {
      priceFormula: PriceFormulaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'primengtestApp.priceFormula.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
