import { ITaskComment } from 'app/shared/model/task-comment.model';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';

export const enum TaskType {
  TYPE1 = 'TYPE1',
  TYPE2 = 'TYPE2',
  TYPE3 = 'TYPE3'
}

export const TASK_TYPE_ARRAY = [TaskType.TYPE1, TaskType.TYPE2, TaskType.TYPE3];

export interface ITask {
  id?: number;
  name?: string;
  type?: TaskType;
  endDate?: Date;
  createdAt?: Date;
  modifiedAt?: Date;
  done?: boolean;
  description?: any;
  attachmentContentType?: string;
  attachment?: any;
  pictureContentType?: string;
  picture?: any;
  comments?: ITaskComment[];
  employeeSkills?: IEmployeeSkill[];
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public name?: string,
    public type?: TaskType,
    public endDate?: Date,
    public createdAt?: Date,
    public modifiedAt?: Date,
    public done?: boolean,
    public description?: any,
    public attachmentContentType?: string,
    public attachment?: any,
    public pictureContentType?: string,
    public picture?: any,
    public comments?: ITaskComment[],
    public employeeSkills?: IEmployeeSkill[]
  ) {
    this.done = this.done || false;
  }
}
