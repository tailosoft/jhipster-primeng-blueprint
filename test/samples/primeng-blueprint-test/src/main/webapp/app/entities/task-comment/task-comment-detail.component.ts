import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITaskComment } from 'app/shared/model/task-comment.model';

@Component({
  selector: 'jhi-task-comment-detail',
  templateUrl: './task-comment-detail.component.html'
})
export class TaskCommentDetailComponent implements OnInit {
  taskComment: ITaskComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taskComment }) => {
      this.taskComment = taskComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
