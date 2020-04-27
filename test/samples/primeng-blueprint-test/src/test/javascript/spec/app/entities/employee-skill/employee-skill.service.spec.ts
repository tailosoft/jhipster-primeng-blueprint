import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeSkillService } from 'app/entities/employee-skill/employee-skill.service';
import { IEmployeeSkill, EmployeeSkill } from 'app/shared/model/employee-skill.model';

describe('Service Tests', () => {
  describe('EmployeeSkill Service', () => {
    let injector: TestBed;
    let service: EmployeeSkillService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmployeeSkill;
    let expectedResult: IEmployeeSkill | IEmployeeSkill[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(EmployeeSkillService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new EmployeeSkill('AAAAAAA', 'AAAAAAA', 123, undefined, undefined, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('AAAAAAA', 'AAAAAAA').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a EmployeeSkill', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new EmployeeSkill()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a EmployeeSkill', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            level: 1
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of EmployeeSkill', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            level: 1
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a EmployeeSkill', () => {
        service.delete('AAAAAAA', 'AAAAAAA').subscribe(resp => (expectedResult = resp.ok));

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
