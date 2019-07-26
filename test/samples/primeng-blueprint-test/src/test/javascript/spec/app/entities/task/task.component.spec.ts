/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PrimengtestTestModule } from '../../../test.module';
import { TaskComponent } from 'app/entities/task/task.component';
import { TaskService } from 'app/entities/task/task.service';
import { Task } from 'app/shared/model/task.model';
import { ConfirmationService } from 'primeng/api';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('Task Management Component', () => {
    let comp: TaskComponent;
    let fixture: ComponentFixture<TaskComponent>;
    let service: TaskService;
    let mockConfirmationService: any;
    let mockEventManager: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [TaskComponent]
      })
        .overrideTemplate(TaskComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TaskService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Task(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.tasks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
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
