import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { PrimengtestSharedModule } from 'app/shared';
import { CertificateTypeComponent, CertificateTypeDetailComponent, CertificateTypeUpdateComponent, certificateTypeRoute } from './';

const ENTITY_STATES = [...certificateTypeRoute];

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [CertificateTypeComponent, CertificateTypeDetailComponent, CertificateTypeUpdateComponent],
  entryComponents: [CertificateTypeComponent, CertificateTypeUpdateComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestCertificateTypeModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
