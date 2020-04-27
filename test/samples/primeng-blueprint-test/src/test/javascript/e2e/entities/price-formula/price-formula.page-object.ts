import { element, by, ElementFinder } from 'protractor';

export class PriceFormulaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-price-formula div table .ui-button-danger'));
  title = element.all(by.css('jhi-price-formula div h2#page-heading span')).first();

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class PriceFormulaUpdatePage {
  pageTitle = element(by.id('jhi-price-formula-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  maxInput = element(by.id('field_max'));
  formulaInput = element(by.id('field_formula'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setMaxInput(max: string): Promise<void> {
    await this.maxInput.sendKeys(max);
  }

  async getMaxInput(): Promise<string> {
    return await this.maxInput.getAttribute('value');
  }

  async setFormulaInput(formula: string): Promise<void> {
    await this.formulaInput.sendKeys(formula);
  }

  async getFormulaInput(): Promise<string> {
    return await this.formulaInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class PriceFormulaDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
