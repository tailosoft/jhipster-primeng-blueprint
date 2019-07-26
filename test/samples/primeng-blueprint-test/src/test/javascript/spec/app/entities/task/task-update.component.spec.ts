/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { PrimengtestTestModule } from '../../../test.module';
import { TaskUpdateComponent } from 'app/entities/task/task-update.component';
import { TaskService } from 'app/entities/task/task.service';
import { Task } from 'app/shared/model/task.model';

describe('Component Tests', () => {
  describe('Task Management Update Component', () => {
    let comp: TaskUpdateComponent;
    let fixture: ComponentFixture<TaskUpdateComponent>;
    let service: TaskService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [TaskUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TaskUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TaskService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Task(123);
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
        const entity = new Task();
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
