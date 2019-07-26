import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class JhiAlertErrorService {
  constructor(private messageService: MessageService, private translateService: TranslateService) {}

  displayError(httpErrorResponse: HttpErrorResponse) {
    let i;
    switch (httpErrorResponse.status) {
      // connection refused, server not reachable
      case 0:
        this.messageService.add({ severity: 'error', summary: this.translateService.instant('error.server.not.reachable') });
        break;

      case 400:
        const arr = httpErrorResponse.headers.keys();
        let errorHeader = null;
        let entityKey = null;
        arr.forEach(entry => {
          if (entry.toLowerCase().endsWith('app-error')) {
            errorHeader = httpErrorResponse.headers.get(entry);
          } else if (entry.toLowerCase().endsWith('app-params')) {
            entityKey = httpErrorResponse.headers.get(entry);
          }
        });
        if (errorHeader) {
          const entityName = this.translateService.instant('global.menu.entities.' + entityKey);
          this.messageService.add({ severity: 'error', summary: this.translateService.instant(errorHeader, { entityName }) });
        } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.fieldErrors) {
          const fieldErrors = httpErrorResponse.error.fieldErrors;
          for (i = 0; i < fieldErrors.length; i++) {
            const fieldError = fieldErrors[i];
            if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
              fieldError.message = 'Size';
            }
            // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
            const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
            const fieldName = this.translateService.instant('primengtestApp.' + fieldError.objectName + '.' + convertedField);
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('error.' + fieldError.message, { fieldName })
            });
          }
        } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant(httpErrorResponse.error.message, httpErrorResponse.error.params)
          });
        } else {
          this.messageService.add({ severity: 'error', summary: this.translateService.instant(httpErrorResponse.error) });
        }
        break;

      case 404:
        this.messageService.add({ severity: 'error', summary: this.translateService.instant('error.url.not.found') });
        break;

      default:
        if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
          this.messageService.add({ severity: 'error', summary: this.translateService.instant(httpErrorResponse.error.message) });
        } else {
          this.messageService.add({ severity: 'error', summary: this.translateService.instant(httpErrorResponse.error) });
        }
    }
  }
}
