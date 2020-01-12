import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPriceFormula } from 'app/shared/model/price-formula.model';
import { PriceFormulaService } from './price-formula.service';

@Component({
  selector: 'jhi-price-formula-update',
  templateUrl: './price-formula-update.component.html'
})
export class PriceFormulaUpdateComponent implements OnInit {
  edit = false;
  isSaving = false;

  editForm = this.fb.group({
    max: [null, [Validators.required]],
    formula: [null, [Validators.required]]
  });

  constructor(protected priceFormulaService: PriceFormulaService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ priceFormula }) => {
      this.updateForm(priceFormula);
    });
  }

  updateForm(priceFormula: IPriceFormula | null): void {
    if (priceFormula) {
      this.edit = true;
      this.editForm.reset({ ...priceFormula });
    } else {
      this.editForm.reset({});
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const priceFormula = this.editForm.value;
    if (this.edit) {
      this.subscribeToSaveResponse(this.priceFormulaService.update(priceFormula));
    } else {
      this.subscribeToSaveResponse(this.priceFormulaService.create(priceFormula));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPriceFormula>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
