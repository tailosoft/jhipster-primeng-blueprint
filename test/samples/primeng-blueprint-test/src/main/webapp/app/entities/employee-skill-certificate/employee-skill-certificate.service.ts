import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';
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

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEmployeeSkillCertificate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmployeeSkillCertificate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(employeeSkillCertificate: IEmployeeSkillCertificate): IEmployeeSkillCertificate {
    const copy: IEmployeeSkillCertificate = Object.assign({}, employeeSkillCertificate, {
      date: employeeSkillCertificate.date != null ? this.datePipe.transform(employeeSkillCertificate.date, DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date != null ? new Date(res.body.date) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((employeeSkillCertificate: IEmployeeSkillCertificate) => {
        employeeSkillCertificate.date = employeeSkillCertificate.date != null ? new Date(employeeSkillCertificate.date) : null;
      });
    }
    return res;
  }
}
