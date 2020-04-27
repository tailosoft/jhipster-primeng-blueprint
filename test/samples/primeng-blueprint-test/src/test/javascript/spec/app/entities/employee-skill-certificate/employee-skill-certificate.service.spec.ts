import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
    let expectedResult: IEmployeeSkillCertificate | IEmployeeSkillCertificate[] | boolean | null;
    let currentDate: Date;
    let datePipe: DatePipe;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [DatePipe]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(EmployeeSkillCertificateService);
      httpMock = injector.get(HttpTestingController);
      currentDate = new Date();
      datePipe = injector.get(DatePipe);

      elemDefault = new EmployeeSkillCertificate(123, 'AAAAAAA', 'AAAAAAA', 123, currentDate, 'AAAAAAA', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: datePipe.transform(currentDate, DATE_FORMAT)
          },
          elemDefault
        );

        service.find(123, 'AAAAAAA', 'AAAAAAA').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a EmployeeSkillCertificate', () => {
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

        service.create(new EmployeeSkillCertificate()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a EmployeeSkillCertificate', () => {
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

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of EmployeeSkillCertificate', () => {
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

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a EmployeeSkillCertificate', () => {
        service.delete(123, 'AAAAAAA', 'AAAAAAA').subscribe(resp => (expectedResult = resp.ok));

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
