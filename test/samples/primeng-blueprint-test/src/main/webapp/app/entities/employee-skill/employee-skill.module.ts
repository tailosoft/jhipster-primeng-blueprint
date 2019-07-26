import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { PrimengtestSharedModule } from 'app/shared';
import { EmployeeSkillComponent, EmployeeSkillDetailComponent, EmployeeSkillUpdateComponent, employeeSkillRoute } from './';

const ENTITY_STATES = [...employeeSkillRoute];

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [EmployeeSkillComponent, EmployeeSkillDetailComponent, EmployeeSkillUpdateComponent],
  entryComponents: [EmployeeSkillComponent, EmployeeSkillUpdateComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestEmployeeSkillModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
