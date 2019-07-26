import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITask } from 'app/shared/model/task.model';

@Component({
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  task: ITask;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
    });
  }

  previousState() {
    window.history.back();
  }
}
