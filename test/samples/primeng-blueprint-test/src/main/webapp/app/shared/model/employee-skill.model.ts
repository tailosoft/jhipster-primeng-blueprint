import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { ITask } from 'app/shared/model/task.model';

export interface IEmployeeSkill {
  id?: number;
  name?: string;
  level?: number;
  employeeSkillCertificates?: IEmployeeSkillCertificate[];
  tasks?: ITask[];
  employeeFullname?: string;
  employeeId?: number;
}

export class EmployeeSkill implements IEmployeeSkill {
  constructor(
    public id?: number,
    public name?: string,
    public level?: number,
    public employeeSkillCertificates?: IEmployeeSkillCertificate[],
    public tasks?: ITask[],
    public employeeFullname?: string,
    public employeeId?: number
  ) {}
}
