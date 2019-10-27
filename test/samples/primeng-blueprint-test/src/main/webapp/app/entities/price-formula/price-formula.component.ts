import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';
import { MessageService } from 'primeng/api';
import { IPriceFormula } from 'app/shared/model/price-formula.model';
import { PriceFormulaService } from './price-formula.service';
import { computeFilterMatchMode } from 'app/shared/util/request-util';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'jhi-price-formula',
  templateUrl: './price-formula.component.html'
})
export class PriceFormulaComponent implements OnInit, OnDestroy {
  priceFormulas: IPriceFormula[];
  eventSubscriber: Subscription;

  private filtersDetails: { [_: string]: { matchMode?: string; flatten?: (_: any) => string; unflatten?: (_: string) => any } } = {
    max: { matchMode: 'equals', unflatten: x => +x }
  };

  @ViewChild('priceFormulaTable', { static: true })
  priceFormulaTable: Table;

  constructor(
    protected priceFormulaService: PriceFormulaService,
    protected messageService: MessageService,
    protected eventManager: JhiEventManager,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadAll();
    this.registerChangeInPriceFormulas();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  loadAll() {
    this.priceFormulaService
      .query()
      .pipe(
        filter((res: HttpResponse<IPriceFormula[]>) => res.ok),
        map((res: HttpResponse<IPriceFormula[]>) => res.body)
      )
      .subscribe(
        (res: IPriceFormula[]) => {
          this.priceFormulas = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  filter(value, field) {
    this.priceFormulaTable.filter(value, field, computeFilterMatchMode(this.filtersDetails[field]));
  }

  delete(max: number) {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('primengtestApp.priceFormula.delete.question', { id: max }),
      accept: () => {
        this.priceFormulaService.delete(max).subscribe(() => {
          this.eventManager.broadcast({
            name: 'priceFormulaListModification',
            content: 'Deleted an priceFormula'
          });
        });
      }
    });
  }

  trackId(index: number, item: IPriceFormula) {
    return item.max;
  }

  registerChangeInPriceFormulas() {
    this.eventSubscriber = this.eventManager.subscribe('priceFormulaListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
