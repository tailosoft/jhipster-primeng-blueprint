import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

export interface ICertificateType {
  id?: number;
  name?: string;
  employeeSkillCertificates?: IEmployeeSkillCertificate[];
}

export class CertificateType implements ICertificateType {
  constructor(public id?: number, public name?: string, public employeeSkillCertificates?: IEmployeeSkillCertificate[]) {}
}
