/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PrimengtestTestModule } from '../../../test.module';
import { EmployeeSkillCertificateComponent } from 'app/entities/employee-skill-certificate/employee-skill-certificate.component';
import { EmployeeSkillCertificateService } from 'app/entities/employee-skill-certificate/employee-skill-certificate.service';
import { EmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { ConfirmationService } from 'primeng/api';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('EmployeeSkillCertificate Management Component', () => {
    let comp: EmployeeSkillCertificateComponent;
    let fixture: ComponentFixture<EmployeeSkillCertificateComponent>;
    let service: EmployeeSkillCertificateService;
    let mockConfirmationService: any;
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
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmployeeSkillCertificate(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employeeSkillCertificates[0]).toEqual(jasmine.objectContaining({ id: 123 }));
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
