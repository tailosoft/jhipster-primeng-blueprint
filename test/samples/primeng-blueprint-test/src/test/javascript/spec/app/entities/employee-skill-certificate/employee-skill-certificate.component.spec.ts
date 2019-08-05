/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PrimengtestTestModule } from '../../../test.module';
import { EmployeeSkillCertificateComponent } from 'app/entities/employee-skill-certificate/employee-skill-certificate.component';
import { EmployeeSkillCertificateService } from 'app/entities/employee-skill-certificate/employee-skill-certificate.service';
import { EmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { ConfirmationService } from 'primeng/api';

import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('EmployeeSkillCertificate Management Component', () => {
    let comp: EmployeeSkillCertificateComponent;
    let fixture: ComponentFixture<EmployeeSkillCertificateComponent>;
    let service: EmployeeSkillCertificateService;
    let mockConfirmationService: any;

    let activatedRoute: MockActivatedRoute;
    let mockEventManager: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [EmployeeSkillCertificateComponent]
      })
        .overrideTemplate(EmployeeSkillCertificateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeSkillCertificateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmployeeSkillCertificateService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmployeeSkillCertificate(123, 'AAAAAAA', 'AAAAAAA')]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      comp.employeeSkillCertificateTable = <any>{};
      // wait for debounce
      tick(300);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employeeSkillCertificates[0]).toEqual(
        jasmine.objectContaining({ typeId: 123, skillName: 'AAAAAAA', skillEmployeeUsername: 'AAAAAAA' })
      );
    }));

    it('should load a page', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmployeeSkillCertificate(123, 'AAAAAAA', 'AAAAAAA')]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      comp.employeeSkillCertificateTable = <any>{};
      tick(100);
      (<BehaviorSubject<any>>activatedRoute.queryParams).next({ lle: { page: 3 } });
      // wait for debounce
      tick(300);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employeeSkillCertificates[0]).toEqual(
        jasmine.objectContaining({ typeId: 123, skillName: 'AAAAAAA', skillEmployeeUsername: 'AAAAAAA' })
      );
    }));

    it('should call delete service using confirmDialog', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'delete').and.returnValue(of({}));

      // WHEN
      comp.delete(123, 'AAAAAAA', 'AAAAAAA');

      // THEN
      expect(mockConfirmationService.confirmSpy).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledWith(123, 'AAAAAAA', 'AAAAAAA');
      expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
    }));
  });
});
