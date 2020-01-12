import { NgModule } from '@angular/core';
import { PrimengtestSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { PrimeNGCommonModule } from 'app/shared/primeng-common.module';
@NgModule({
  imports: [PrimengtestSharedLibsModule, PrimeNGCommonModule],
  declarations: [FindLanguageFromKeyPipe, LoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [LoginModalComponent],
  exports: [PrimengtestSharedLibsModule, FindLanguageFromKeyPipe, LoginModalComponent, HasAnyAuthorityDirective, PrimeNGCommonModule]
})
export class PrimengtestSharedModule {}
