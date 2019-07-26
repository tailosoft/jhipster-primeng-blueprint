import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITask } from 'app/shared/model/task.model';

type EntityResponseType = HttpResponse<ITask>;
type EntityArrayResponseType = HttpResponse<ITask[]>;

@Injectable({ providedIn: 'root' })
export class TaskService {
  public resourceUrl = SERVER_API_URL + 'api/tasks';

  constructor(protected http: HttpClient) {}

  create(task: ITask): Observable<EntityResponseType> {
    return this.http.post<ITask>(this.resourceUrl, task, { observe: 'response' });
  }

  update(task: ITask): Observable<EntityResponseType> {
    return this.http.put<ITask>(this.resourceUrl, task, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITask>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITask[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
