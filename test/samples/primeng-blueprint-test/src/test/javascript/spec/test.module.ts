import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService, JhiDataUtils, JhiDateUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { MockLanguageService } from './helpers/mock-language.service';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { MockAccountService } from './helpers/mock-account.service';
import { MockActivatedRoute, MockRouter } from './helpers/mock-route.service';
import { MockActiveModal } from './helpers/mock-active-modal.service';
import { MockEventManager } from './helpers/mock-event-manager.service';
import { ConfirmationService } from 'primeng/api';
import { MockConfirmationService } from './helpers/mock-confirmation.service';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from './helpers/mock-translate.service';

@NgModule({
  providers: [
    DatePipe,
    JhiDataUtils,
    JhiDateUtils,
    JhiParseLinks,
    {
      provide: JhiLanguageService,
      useClass: MockLanguageService
    },
    {
      provide: JhiEventManager,
      useClass: MockEventManager
    },
    {
      provide: TranslateService,
      useValue: new MockTranslateService()
    },
    {
      provide: ConfirmationService,
      useValue: new MockConfirmationService()
    },
    {
      provide: NgbActiveModal,
      useClass: MockActiveModal
    },
    {
      provide: ActivatedRoute,
      useValue: new MockActivatedRoute({ id: 123 })
    },
    {
      provide: Router,
      useClass: MockRouter
    },
    {
      provide: AccountService,
      useClass: MockAccountService
    },
    {
      provide: LoginModalService,
      useValue: null
    },
    {
      provide: MessageService,
      useValue: null
    },
    {
      provide: NgbModal,
      useValue: null
    }
  ],
  imports: [HttpClientTestingModule]
})
export class PrimengtestTestModule {}
