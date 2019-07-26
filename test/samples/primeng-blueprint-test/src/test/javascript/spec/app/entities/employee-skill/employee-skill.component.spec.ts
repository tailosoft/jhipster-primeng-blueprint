/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PrimengtestTestModule } from '../../../test.module';
import { EmployeeSkillComponent } from 'app/entities/employee-skill/employee-skill.component';
import { EmployeeSkillService } from 'app/entities/employee-skill/employee-skill.service';
import { EmployeeSkill } from 'app/shared/model/employee-skill.model';
import { ConfirmationService } from 'primeng/api';

import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('EmployeeSkill Management Component', () => {
    let comp: EmployeeSkillComponent;
    let fixture: ComponentFixture<EmployeeSkillComponent>;
    let service: EmployeeSkillService;
    let mockConfirmationService: any;

    let activatedRoute: MockActivatedRoute;
    let mockEventManager: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [EmployeeSkillComponent]
      })
        .overrideTemplate(EmployeeSkillComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeSkillComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmployeeSkillService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmployeeSkill(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      comp.employeeSkillTable = <any>{};
      // wait for debounce
      tick(300);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employeeSkills[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    }));

    it('should load a page', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmployeeSkill(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      comp.employeeSkillTable = <any>{};
      tick(100);
      (<BehaviorSubject<any>>activatedRoute.queryParams).next({ lle: { page: 3 } });
      // wait for debounce
      tick(300);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employeeSkills[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    }));

    it('should call delete service using confirmDialog', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'delete').and.returnValue(of({}));

      // WHEN
      comp.delete(123);

      // THEN
      expect(mockConfirmationService.confirmSpy).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledWith(123);
      expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
    }));
  });
});
