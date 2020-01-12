import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PrimengtestTestModule } from '../../../test.module';
import { CertificateTypeDetailComponent } from 'app/entities/certificate-type/certificate-type-detail.component';
import { CertificateType } from 'app/shared/model/certificate-type.model';

describe('Component Tests', () => {
  describe('CertificateType Management Detail Component', () => {
    let comp: CertificateTypeDetailComponent;
    let fixture: ComponentFixture<CertificateTypeDetailComponent>;
    const route = ({ data: of({ certificateType: new CertificateType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PrimengtestTestModule],
        declarations: [CertificateTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CertificateTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CertificateTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load certificateType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.certificateType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
