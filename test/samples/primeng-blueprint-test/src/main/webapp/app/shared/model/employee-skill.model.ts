import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';
import { ITask } from 'app/shared/model/task.model';

export interface IEmployeeSkill {
  name?: string;
  employeeUsername?: string;
  level?: number;
  employeeSkillCertificates?: IEmployeeSkillCertificate[];
  tasks?: ITask[];
  employeeFullname?: string;
  teacherFullname?: string;
  teacherUsername?: string;
}

export class EmployeeSkill implements IEmployeeSkill {
  constructor(
    public name?: string,
    public employeeUsername?: string,
    public level?: number,
    public employeeSkillCertificates?: IEmployeeSkillCertificate[],
    public tasks?: ITask[],
    public employeeFullname?: string,
    public teacherFullname?: string,
    public teacherUsername?: string
  ) {}
}
