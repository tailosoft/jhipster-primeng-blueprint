/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PrimengtestTestModule } from '../../../test.module';
import { PriceFormulaDetailComponent } from 'app/entities/price-formula/price-formula-detail.component';
import { PriceFormula } from 'app/shared/model/price-formula.model';

describe('Component Tests', () => {
  describe('PriceFormula Management Detail Component', () => {
    let comp: PriceFormulaDetailComponent;
    let fixture: ComponentFixture<PriceFormulaDetailComponent>;
    const route = ({ data: of({ priceFormula: new PriceFormula(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [PriceFormulaDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PriceFormulaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PriceFormulaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.priceFormula).toEqual(jasmine.objectContaining({ max: 123 }));
      });
    });
  });
});
