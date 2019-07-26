/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PrimengtestTestModule } from '../../../test.module';
import { EmployeeComponent } from 'app/entities/employee/employee.component';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { Employee } from 'app/shared/model/employee.model';
import { ConfirmationService } from 'primeng/api';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('Employee Management Component', () => {
    let comp: EmployeeComponent;
    let fixture: ComponentFixture<EmployeeComponent>;
    let service: EmployeeService;
    let mockConfirmationService: any;
    let mockEventManager: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [EmployeeComponent]
      })
        .overrideTemplate(EmployeeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmployeeService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Employee(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employees[0]).toEqual(jasmine.objectContaining({ id: 123 }));
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
