export interface IEmployeeSkillCertificate {
  typeId?: number;
  skillName?: string;
  skillEmployeeUsername?: string;
  grade?: number;
  date?: Date;
  typeName?: string;
  skillEmployeeFullname?: string;
}

export class EmployeeSkillCertificate implements IEmployeeSkillCertificate {
  constructor(
    public typeId?: number,
    public skillName?: string,
    public skillEmployeeUsername?: string,
    public grade?: number,
    public date?: Date,
    public typeName?: string,
    public skillEmployeeFullname?: string
  ) {}
}
