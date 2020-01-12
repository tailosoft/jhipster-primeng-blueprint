import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { PrimengtestTestModule } from '../../../test.module';
import { TaskCommentUpdateComponent } from 'app/entities/task-comment/task-comment-update.component';
import { TaskCommentService } from 'app/entities/task-comment/task-comment.service';
import { TaskComment } from 'app/shared/model/task-comment.model';

describe('Component Tests', () => {
  describe('TaskComment Management Update Component', () => {
    let comp: TaskCommentUpdateComponent;
    let fixture: ComponentFixture<TaskCommentUpdateComponent>;
    let service: TaskCommentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [TaskCommentUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TaskCommentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskCommentUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TaskCommentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new TaskComment(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(comp.editForm.value);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = null;
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(comp.editForm.value);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
