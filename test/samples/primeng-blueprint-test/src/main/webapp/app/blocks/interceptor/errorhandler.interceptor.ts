import { Injectable } from '@angular/core';
import { JhiAlertErrorService } from 'app/shared/alert/alert-error.service';
import { HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private alertErrorService: JhiAlertErrorService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (!(err.status === 401 && (err.message === '' || (err.url && err.url.includes('api/account'))))) {
              this.alertErrorService.displayError(err);
            }
          }
        }
      )
    );
  }
}
