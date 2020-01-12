import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PrimengtestTestModule } from '../../../test.module';
import { TaskCommentDetailComponent } from 'app/entities/task-comment/task-comment-detail.component';
import { TaskComment } from 'app/shared/model/task-comment.model';

describe('Component Tests', () => {
  describe('TaskComment Management Detail Component', () => {
    let comp: TaskCommentDetailComponent;
    let fixture: ComponentFixture<TaskCommentDetailComponent>;
    const route = ({ data: of({ taskComment: new TaskComment(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [TaskCommentDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(TaskCommentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TaskCommentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load taskComment on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.taskComment).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
