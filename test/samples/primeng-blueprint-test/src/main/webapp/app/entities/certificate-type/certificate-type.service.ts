import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICertificateType } from 'app/shared/model/certificate-type.model';

type EntityResponseType = HttpResponse<ICertificateType>;
type EntityArrayResponseType = HttpResponse<ICertificateType[]>;

@Injectable({ providedIn: 'root' })
export class CertificateTypeService {
  public resourceUrl = SERVER_API_URL + 'api/certificate-types';

  constructor(protected http: HttpClient) {}

  create(certificateType: ICertificateType): Observable<EntityResponseType> {
    return this.http.post<ICertificateType>(this.resourceUrl, certificateType, { observe: 'response' });
  }

  update(certificateType: ICertificateType): Observable<EntityResponseType> {
    return this.http.put<ICertificateType>(this.resourceUrl, certificateType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICertificateType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICertificateType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
