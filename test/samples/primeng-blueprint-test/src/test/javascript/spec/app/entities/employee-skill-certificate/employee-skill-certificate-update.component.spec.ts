/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { PrimengtestTestModule } from '../../../test.module';
import { EmployeeSkillCertificateUpdateComponent } from 'app/entities/employee-skill-certificate/employee-skill-certificate-update.component';
import { EmployeeSkillCertificateService } from 'app/entities/employee-skill-certificate/employee-skill-certificate.service';
import { EmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

describe('Component Tests', () => {
  describe('EmployeeSkillCertificate Management Update Component', () => {
    let comp: EmployeeSkillCertificateUpdateComponent;
    let fixture: ComponentFixture<EmployeeSkillCertificateUpdateComponent>;
    let service: EmployeeSkillCertificateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [EmployeeSkillCertificateUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(EmployeeSkillCertificateUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeSkillCertificateUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmployeeSkillCertificateService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new EmployeeSkillCertificate(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new EmployeeSkillCertificate();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
