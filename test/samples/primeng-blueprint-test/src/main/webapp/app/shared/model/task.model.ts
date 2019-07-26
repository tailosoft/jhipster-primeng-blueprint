import { ITaskComment } from 'app/shared/model/task-comment.model';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';

export interface ITask {
  id?: number;
  name?: string;
  comments?: ITaskComment[];
  employeeSkills?: IEmployeeSkill[];
}

export class Task implements ITask {
  constructor(public id?: number, public name?: string, public comments?: ITaskComment[], public employeeSkills?: IEmployeeSkill[]) {}
}
