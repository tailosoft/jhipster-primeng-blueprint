import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';

export interface IEmployee {
  username?: string;
  fullname?: string;
  skills?: IEmployeeSkill[];
}

export class Employee implements IEmployee {
  constructor(public username?: string, public fullname?: string, public skills?: IEmployeeSkill[]) {}
}
