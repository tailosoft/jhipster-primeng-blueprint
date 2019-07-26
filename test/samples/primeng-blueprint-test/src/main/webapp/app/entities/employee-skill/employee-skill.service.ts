import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEmployeeSkill } from 'app/shared/model/employee-skill.model';

type EntityResponseType = HttpResponse<IEmployeeSkill>;
type EntityArrayResponseType = HttpResponse<IEmployeeSkill[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeSkillService {
  public resourceUrl = SERVER_API_URL + 'api/employee-skills';

  constructor(protected http: HttpClient) {}

  create(employeeSkill: IEmployeeSkill): Observable<EntityResponseType> {
    return this.http.post<IEmployeeSkill>(this.resourceUrl, employeeSkill, { observe: 'response' });
  }

  update(employeeSkill: IEmployeeSkill): Observable<EntityResponseType> {
    return this.http.put<IEmployeeSkill>(this.resourceUrl, employeeSkill, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmployeeSkill>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmployeeSkill[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
