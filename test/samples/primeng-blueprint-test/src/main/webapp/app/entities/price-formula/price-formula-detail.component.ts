import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPriceFormula } from 'app/shared/model/price-formula.model';

@Component({
  selector: 'jhi-price-formula-detail',
  templateUrl: './price-formula-detail.component.html'
})
export class PriceFormulaDetailComponent implements OnInit {
  priceFormula: IPriceFormula | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ priceFormula }) => (this.priceFormula = priceFormula));
  }

  previousState(): void {
    window.history.back();
  }
}
