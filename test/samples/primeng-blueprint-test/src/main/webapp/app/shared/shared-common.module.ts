import { NgModule } from '@angular/core';

import { PrimengtestSharedLibsModule, FindLanguageFromKeyPipe } from './';

@NgModule({
  imports: [PrimengtestSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe],
  exports: [PrimengtestSharedLibsModule, FindLanguageFromKeyPipe]
})
export class PrimengtestSharedCommonModule {}
