/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PrimengtestTestModule } from '../../../test.module';
import { PriceFormulaComponent } from 'app/entities/price-formula/price-formula.component';
import { PriceFormulaService } from 'app/entities/price-formula/price-formula.service';
import { PriceFormula } from 'app/shared/model/price-formula.model';
import { ConfirmationService } from 'primeng/api';
import { JhiEventManager } from 'ng-jhipster';

describe('Component Tests', () => {
  describe('PriceFormula Management Component', () => {
    let comp: PriceFormulaComponent;
    let fixture: ComponentFixture<PriceFormulaComponent>;
    let service: PriceFormulaService;
    let mockConfirmationService: any;
    let mockEventManager: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [PriceFormulaComponent]
      })
        .overrideTemplate(PriceFormulaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PriceFormulaComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PriceFormulaService);
      mockConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
    });

    it('Should call load all on init', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PriceFormula(123)]
          })
        )
      );

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.priceFormulas[0]).toEqual(jasmine.objectContaining({ max: 123 }));
    }));

    it('should call delete service using confirmDialog', fakeAsync(() => {
      // GIVEN
      spyOn(service, 'delete').and.returnValue(of({}));

      // WHEN
      comp.delete(123);

      // THEN
      expect(mockConfirmationService.confirmSpy).toHaveBeenCalled();
      expect(service.delete).toHaveBeenCalledWith(123);
      expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
    }));
  });
});
