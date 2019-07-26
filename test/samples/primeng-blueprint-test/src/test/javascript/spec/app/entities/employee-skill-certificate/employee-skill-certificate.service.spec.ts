/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { DatePipe } from '@angular/common';
import { EmployeeSkillCertificateService } from 'app/entities/employee-skill-certificate/employee-skill-certificate.service';
import { IEmployeeSkillCertificate, EmployeeSkillCertificate } from 'app/shared/model/employee-skill-certificate.model';

describe('Service Tests', () => {
  describe('EmployeeSkillCertificate Service', () => {
    let injector: TestBed;
    let service: EmployeeSkillCertificateService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmployeeSkillCertificate;
    let expectedResult;
    let currentDate: Date;
    let datePipe: DatePipe;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [DatePipe]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(EmployeeSkillCertificateService);
      httpMock = injector.get(HttpTestingController);
      currentDate = new Date();
      datePipe = injector.get(DatePipe);

      elemDefault = new EmployeeSkillCertificate(0, 0, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            date: datePipe.transform(currentDate, DATE_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a EmployeeSkillCertificate', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: datePipe.transform(currentDate, DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            date: currentDate
          },
          returnedFromService
        );
        service
          .create(new EmployeeSkillCertificate(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a EmployeeSkillCertificate', async () => {
        const returnedFromService = Object.assign(
          {
            grade: 1,
            date: datePipe.transform(currentDate, DATE_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of EmployeeSkillCertificate', async () => {
        const returnedFromService = Object.assign(
          {
            grade: 1,
            date: datePipe.transform(currentDate, DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            date: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a EmployeeSkillCertificate', async () => {
        const rxPromise = service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
