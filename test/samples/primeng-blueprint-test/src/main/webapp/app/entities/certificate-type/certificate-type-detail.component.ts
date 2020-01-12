import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICertificateType } from 'app/shared/model/certificate-type.model';

@Component({
  selector: 'jhi-certificate-type-detail',
  templateUrl: './certificate-type-detail.component.html'
})
export class CertificateTypeDetailComponent implements OnInit {
  certificateType: ICertificateType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ certificateType }) => {
      this.certificateType = certificateType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
