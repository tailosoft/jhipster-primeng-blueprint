import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPriceFormula } from 'app/shared/model/price-formula.model';

type EntityResponseType = HttpResponse<IPriceFormula>;
type EntityArrayResponseType = HttpResponse<IPriceFormula[]>;

@Injectable({ providedIn: 'root' })
export class PriceFormulaService {
  public resourceUrl = SERVER_API_URL + 'api/price-formulas';

  constructor(protected http: HttpClient) {}

  create(priceFormula: IPriceFormula): Observable<EntityResponseType> {
    return this.http.post<IPriceFormula>(this.resourceUrl, priceFormula, { observe: 'response' });
  }

  update(priceFormula: IPriceFormula): Observable<EntityResponseType> {
    return this.http.put<IPriceFormula>(this.resourceUrl, priceFormula, { observe: 'response' });
  }

  find(max: number): Observable<EntityResponseType> {
    return this.http.get<IPriceFormula>(`${this.resourceUrl}/${max}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPriceFormula[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(max: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${max}`, { observe: 'response' });
  }
}
