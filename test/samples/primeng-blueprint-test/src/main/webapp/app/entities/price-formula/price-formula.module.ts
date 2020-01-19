import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { PriceFormulaComponent } from './price-formula.component';
import { PriceFormulaDetailComponent } from './price-formula-detail.component';
import { PriceFormulaUpdateComponent } from './price-formula-update.component';
import { priceFormulaRoute } from './price-formula.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(priceFormulaRoute)],
  declarations: [PriceFormulaComponent, PriceFormulaDetailComponent, PriceFormulaUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestPriceFormulaModule {}
