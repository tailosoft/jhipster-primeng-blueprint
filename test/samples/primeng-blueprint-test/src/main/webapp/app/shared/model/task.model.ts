import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';
import { TaskType } from 'app/shared/model/enumerations/task-type.model';

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
    public employeeSkills?: IEmployeeSkill[]
  ) {}
}
