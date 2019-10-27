/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PrimengtestTestModule } from '../../../test.module';
import { EmployeeComponent } from 'app/entities/employee/employee.component';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { Employee } from 'app/shared/model/employee.model';
import { ConfirmationService } from 'primeng/api';

import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { MockTable } from '../../../helpers/mock-table';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('Employee Management Component', () => {
    let comp: EmployeeComponent;
    let fixture: ComponentFixture<EmployeeComponent>;
    let service: EmployeeService;
    let mockConfirmationService: any;

    let activatedRoute: MockActivatedRoute;
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
      comp.employeeTable = <any>new MockTable();
      service = fixture.debugElement.injector.get(EmployeeService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Employee('AAAAAAA')]
          })
        )
      );

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employees[0]).toEqual(jasmine.objectContaining({ username: 'AAAAAAA' }));
    }));

    it('should load a page', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Employee('AAAAAAA')]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      tick(100);
      (<BehaviorSubject<any>>activatedRoute.queryParams).next({ first: 3 });

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employees[0]).toEqual(jasmine.objectContaining({ username: 'AAAAAAA' }));
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
