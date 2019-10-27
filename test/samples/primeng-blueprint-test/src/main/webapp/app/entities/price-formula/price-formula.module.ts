import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { PrimengtestSharedModule } from 'app/shared';
import { PriceFormulaComponent, PriceFormulaDetailComponent, PriceFormulaUpdateComponent, priceFormulaRoute } from './';

const ENTITY_STATES = [...priceFormulaRoute];

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [PriceFormulaComponent, PriceFormulaDetailComponent, PriceFormulaUpdateComponent],
  entryComponents: [PriceFormulaComponent, PriceFormulaUpdateComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestPriceFormulaModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
