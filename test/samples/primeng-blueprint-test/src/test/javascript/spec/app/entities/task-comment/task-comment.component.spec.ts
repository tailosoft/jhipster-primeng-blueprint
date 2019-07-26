/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PrimengtestTestModule } from '../../../test.module';
import { TaskCommentComponent } from 'app/entities/task-comment/task-comment.component';
import { TaskCommentService } from 'app/entities/task-comment/task-comment.service';
import { TaskComment } from 'app/shared/model/task-comment.model';
import { ConfirmationService } from 'primeng/api';

import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('TaskComment Management Component', () => {
    let comp: TaskCommentComponent;
    let fixture: ComponentFixture<TaskCommentComponent>;
    let service: TaskCommentService;
    let mockConfirmationService: any;

    let activatedRoute: MockActivatedRoute;
    let mockEventManager: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [TaskCommentComponent]
      })
        .overrideTemplate(TaskCommentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskCommentComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TaskCommentService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new TaskComment(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      comp.taskCommentTable = <any>{};
      // wait for debounce
      tick(300);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.taskComments[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    }));

    it('should load a page', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new TaskComment(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();
      comp.taskCommentTable = <any>{};
      tick(100);
      (<BehaviorSubject<any>>activatedRoute.queryParams).next({ lle: { page: 3 } });
      // wait for debounce
      tick(300);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.taskComments[0]).toEqual(jasmine.objectContaining({ id: 123 }));
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
