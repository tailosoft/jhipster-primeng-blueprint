import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';

export interface IEmployee {
  id?: number;
  username?: string;
  fullname?: string;
  skills?: IEmployeeSkill[];
}

export class Employee implements IEmployee {
  constructor(public id?: number, public username?: string, public fullname?: string, public skills?: IEmployeeSkill[]) {}
}
