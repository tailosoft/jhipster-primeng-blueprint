export interface ITaskComment {
  id?: number;
  value?: string;
  taskName?: string;
  taskId?: number;
}

export class TaskComment implements ITaskComment {
  constructor(public id?: number, public value?: string, public taskName?: string, public taskId?: number) {}
}
