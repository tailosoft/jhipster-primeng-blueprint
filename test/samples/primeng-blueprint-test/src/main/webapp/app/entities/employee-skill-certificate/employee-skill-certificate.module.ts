import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { PrimengtestSharedModule } from 'app/shared';
import {
  EmployeeSkillCertificateComponent,
  EmployeeSkillCertificateDetailComponent,
  EmployeeSkillCertificateUpdateComponent,
  employeeSkillCertificateRoute
} from './';

const ENTITY_STATES = [...employeeSkillCertificateRoute];

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [EmployeeSkillCertificateComponent, EmployeeSkillCertificateDetailComponent, EmployeeSkillCertificateUpdateComponent],
  entryComponents: [EmployeeSkillCertificateComponent, EmployeeSkillCertificateUpdateComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestEmployeeSkillCertificateModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
