import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DATE_FORMAT } from 'app/config/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

type EntityResponseType = HttpResponse<IEmployeeSkillCertificate>;
type EntityArrayResponseType = HttpResponse<IEmployeeSkillCertificate[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeSkillCertificateService {
  public resourceUrl = SERVER_API_URL + 'api/employee-skill-certificates';

  constructor(protected http: HttpClient, protected datePipe: DatePipe) {}

  create(employeeSkillCertificate: IEmployeeSkillCertificate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employeeSkillCertificate);
    return this.http
      .post<IEmployeeSkillCertificate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(employeeSkillCertificate: IEmployeeSkillCertificate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employeeSkillCertificate);
    return this.http
      .put<IEmployeeSkillCertificate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(typeId: number, skillName: string, skillEmployeeUsername: string): Observable<EntityResponseType> {
    return this.http
      .get<IEmployeeSkillCertificate>(
        `${this.resourceUrl}/typeId=${typeId};skillName=${skillName};skillEmployeeUsername=${skillEmployeeUsername}`,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmployeeSkillCertificate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(typeId: number, skillName: string, skillEmployeeUsername: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(
      `${this.resourceUrl}/typeId=${typeId};skillName=${skillName};skillEmployeeUsername=${skillEmployeeUsername}`,
      { observe: 'response' }
    );
  }

  protected convertDateFromClient(employeeSkillCertificate: IEmployeeSkillCertificate): IEmployeeSkillCertificate {
    const copy: IEmployeeSkillCertificate = Object.assign({}, employeeSkillCertificate, {
      date: employeeSkillCertificate.date != null ? this.datePipe.transform(employeeSkillCertificate.date, DATE_FORMAT) : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? new Date(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((employeeSkillCertificate: IEmployeeSkillCertificate) => {
        employeeSkillCertificate.date = employeeSkillCertificate.date ? new Date(employeeSkillCertificate.date) : undefined;
      });
    }
    return res;
  }
}
