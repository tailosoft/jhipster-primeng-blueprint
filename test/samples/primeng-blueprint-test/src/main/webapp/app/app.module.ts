import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { PrimengtestSharedModule, PrimeNGCommonModule } from 'app/shared';
import { PrimengtestCoreModule } from 'app/core';
import { PrimengtestAppRoutingModule } from './app-routing.module';
import { PrimengtestHomeModule } from './home/home.module';
import { PrimengtestAccountModule } from './account/account.module';
import { PrimengtestEntityModule } from './entities/entity.module';
import { ConfirmationService, MessageService } from 'primeng/api';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ActiveMenuDirective, ErrorComponent } from './layouts';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
    NgJhipsterModule.forRoot({
      // set below to true to make alerts look like toast
      alertAsToast: false,
      alertTimeout: 5000,
      i18nEnabled: true,
      defaultI18nLang: 'en'
    }),
    PrimengtestSharedModule.forRoot(),
    PrimeNGCommonModule,
    PrimengtestCoreModule,
    PrimengtestHomeModule,
    PrimengtestAccountModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    PrimengtestEntityModule,
    PrimengtestAppRoutingModule
  ],
  declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true
    },
    ConfirmationService,
    MessageService
  ],
  bootstrap: [JhiMainComponent]
})
export class PrimengtestAppModule {
  constructor() {}
}
