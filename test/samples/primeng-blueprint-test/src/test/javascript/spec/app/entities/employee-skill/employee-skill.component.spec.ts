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
import { MockTable } from '../../../helpers/mock-table';
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
      comp.employeeSkillTable = new MockTable() as any;
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
            body: [new EmployeeSkill('AAAAAAA', 'AAAAAAA')]
          })
        )
      );

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employeeSkills && comp.employeeSkills[0]).toEqual(
        jasmine.objectContaining({ name: 'AAAAAAA', employeeUsername: 'AAAAAAA' })
      );
    }));

    it('should load a page', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmployeeSkill('AAAAAAA', 'AAAAAAA')]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      tick(100);
      (activatedRoute.queryParams as BehaviorSubject<any>).next({ first: 3 });

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employeeSkills && comp.employeeSkills[0]).toEqual(
        jasmine.objectContaining({ name: 'AAAAAAA', employeeUsername: 'AAAAAAA' })
      );
    }));

    it('should call delete service using confirmDialog', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'delete').and.returnValue(of({}));

      // WHEN
      comp.delete('AAAAAAA', 'AAAAAAA');

      // THEN
      expect(mockConfirmationService.confirmSpy).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledWith('AAAAAAA', 'AAAAAAA');
      expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
    }));
  });
});
