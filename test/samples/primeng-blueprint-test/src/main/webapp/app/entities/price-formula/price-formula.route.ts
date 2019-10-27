import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PriceFormula } from 'app/shared/model/price-formula.model';
import { PriceFormulaService } from './price-formula.service';
import { PriceFormulaComponent } from './price-formula.component';
import { PriceFormulaDetailComponent } from './price-formula-detail.component';
import { PriceFormulaUpdateComponent } from './price-formula-update.component';
import { IPriceFormula } from 'app/shared/model/price-formula.model';

@Injectable({ providedIn: 'root' })
export class PriceFormulaResolve implements Resolve<IPriceFormula> {
  constructor(private service: PriceFormulaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPriceFormula> {
    const max = route.params['max'] ? route.params['max'] : null;
    if (max) {
      return this.service.find(max).pipe(
        filter((response: HttpResponse<PriceFormula>) => response.ok),
        map((priceFormula: HttpResponse<PriceFormula>) => priceFormula.body)
      );
    }
    return of(new PriceFormula());
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
