import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrimengtestSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective, PrimeNGCommonModule } from './';

@NgModule({
  imports: [PrimengtestSharedCommonModule, PrimeNGCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [PrimengtestSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective, PrimeNGCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengtestSharedModule {
  static forRoot() {
    return {
      ngModule: PrimengtestSharedModule
    };
  }
}
