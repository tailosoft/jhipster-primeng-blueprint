import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITaskComment } from 'app/shared/model/task-comment.model';

type EntityResponseType = HttpResponse<ITaskComment>;
type EntityArrayResponseType = HttpResponse<ITaskComment[]>;

@Injectable({ providedIn: 'root' })
export class TaskCommentService {
  public resourceUrl = SERVER_API_URL + 'api/task-comments';

  constructor(protected http: HttpClient) {}

  create(taskComment: ITaskComment): Observable<EntityResponseType> {
    return this.http.post<ITaskComment>(this.resourceUrl, taskComment, { observe: 'response' });
  }

  update(taskComment: ITaskComment): Observable<EntityResponseType> {
    return this.http.put<ITaskComment>(this.resourceUrl, taskComment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITaskComment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaskComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
