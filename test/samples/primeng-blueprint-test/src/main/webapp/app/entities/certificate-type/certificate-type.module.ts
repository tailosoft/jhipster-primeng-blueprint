import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimengtestSharedModule } from 'app/shared/shared.module';
import { CertificateTypeComponent } from './certificate-type.component';
import { CertificateTypeDetailComponent } from './certificate-type-detail.component';
import { CertificateTypeUpdateComponent } from './certificate-type-update.component';
import { certificateTypeRoute } from './certificate-type.route';

@NgModule({
  imports: [PrimengtestSharedModule, RouterModule.forChild(certificateTypeRoute)],
  declarations: [CertificateTypeComponent, CertificateTypeDetailComponent, CertificateTypeUpdateComponent]
})
export class PrimengtestCertificateTypeModule {}
