import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPriceFormula } from 'app/shared/model/price-formula.model';

@Component({
  selector: 'jhi-price-formula-detail',
  templateUrl: './price-formula-detail.component.html'
})
export class PriceFormulaDetailComponent implements OnInit {
  priceFormula: IPriceFormula;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ priceFormula }) => {
      this.priceFormula = priceFormula;
    });
  }

  previousState() {
    window.history.back();
  }
}
