/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PrimengtestTestModule } from '../../../test.module';
import { UserMgmtComponent } from 'app/admin/user-management/user-management.component';
import { UserService, User } from 'app/core';
import { ConfirmationService } from 'primeng/api';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { MockTable } from '../../../helpers/mock-table';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('User Management Component', () => {
    let comp: UserMgmtComponent;
    let fixture: ComponentFixture<UserMgmtComponent>;
    let service: UserService;
    let mockConfirmationService: any;

    let activatedRoute: MockActivatedRoute;
    let mockEventManager: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [UserMgmtComponent]
      })
        .overrideTemplate(UserMgmtComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserMgmtComponent);
      comp = fixture.componentInstance;
      comp.userTable = <any>new MockTable();
      service = fixture.debugElement.injector.get(UserService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new User(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.users[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    }));

    it('should load a page', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new User(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      tick(100);
      (<BehaviorSubject<any>>activatedRoute.queryParams).next({ first: 3 });

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.users[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    }));

    it('should call delete service using confirmDialog', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'delete').and.returnValue(of({}));

      // WHEN
      comp.delete('AAAAAAA');

      // THEN
      expect(mockConfirmationService.confirmSpy).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledWith('AAAAAAA');
      expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
    }));
  });
});
