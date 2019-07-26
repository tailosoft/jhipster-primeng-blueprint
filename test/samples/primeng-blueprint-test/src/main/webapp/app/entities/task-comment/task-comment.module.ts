import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { PrimengtestSharedModule } from 'app/shared';
import { TaskCommentComponent, TaskCommentDetailComponent, TaskCommentUpdateComponent, taskCommentRoute } from './';

const ENTITY_STATES = [...taskCommentRoute];

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [TaskCommentComponent, TaskCommentDetailComponent, TaskCommentUpdateComponent],
  entryComponents: [TaskCommentComponent, TaskCommentUpdateComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestTaskCommentModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
