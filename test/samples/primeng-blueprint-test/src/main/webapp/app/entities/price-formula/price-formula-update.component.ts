import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPriceFormula, PriceFormula } from 'app/shared/model/price-formula.model';
import { PriceFormulaService } from './price-formula.service';

@Component({
  selector: 'jhi-price-formula-update',
  templateUrl: './price-formula-update.component.html'
})
export class PriceFormulaUpdateComponent implements OnInit {
  edit: boolean;
  isSaving: boolean;

  editForm = this.fb.group({
    max: [null, [Validators.required]],
    formula: [null, [Validators.required]]
  });

  constructor(protected priceFormulaService: PriceFormulaService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ priceFormula }) => {
      this.updateForm(priceFormula);
    });
  }

  updateForm(priceFormula: IPriceFormula) {
    if (priceFormula) {
      this.edit = true;
      this.editForm.reset({ ...priceFormula });
    } else {
      this.editForm.reset({});
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const priceFormula = this.editForm.value;
    if (this.edit) {
      this.subscribeToSaveResponse(this.priceFormulaService.update(priceFormula));
    } else {
      this.subscribeToSaveResponse(this.priceFormulaService.create(priceFormula));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPriceFormula>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
