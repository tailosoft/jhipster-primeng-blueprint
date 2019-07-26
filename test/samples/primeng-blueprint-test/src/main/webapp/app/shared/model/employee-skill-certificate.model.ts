export interface IEmployeeSkillCertificate {
  id?: number;
  grade?: number;
  date?: Date;
  typeName?: string;
  typeId?: number;
  skillId?: number;
}

export class EmployeeSkillCertificate implements IEmployeeSkillCertificate {
  constructor(
    public id?: number,
    public grade?: number,
    public date?: Date,
    public typeName?: string,
    public typeId?: number,
    public skillId?: number
  ) {}
}
