import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PrimengtestTestModule } from '../../../test.module';
import { UserMgmtComponent } from 'app/admin/user-management/user-management.component';
import { UserService, User } from 'app/core';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('User Management Component', () => {
    let comp: UserMgmtComponent;
    let fixture: ComponentFixture<UserMgmtComponent>;
    let service: UserService;
    let mockEventManager: any;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [UserMgmtComponent]
      })
        .overrideTemplate(UserMgmtComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserMgmtComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    }));

    describe('OnInit', () => {
      it('Should call load all on init', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const headers = new HttpHeaders().append('link', 'link;link');
          spyOn(service, 'query').and.returnValue(
            of(
              new HttpResponse({
                body: [new User(123)],
                headers
              })
            )
          );

          // WHEN
          fixture.detectChanges();
          comp.userTable = <any>{};
          // wait for debounce
          tick(300);

          // THEN
          expect(service.query).toHaveBeenCalled();
          expect(comp.users[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        })
      ));
    });

    describe('setActive', () => {
      it('Should update user and call load all', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const user = new User(123);
          spyOn(service, 'update').and.returnValue(of(new HttpResponse({ status: 200 })));

          // WHEN
          comp.setActive(user, true);
          tick(); // simulate async

          // THEN
          expect(service.update).toHaveBeenCalledWith(user);
        })
      ));
    });
  });
});
