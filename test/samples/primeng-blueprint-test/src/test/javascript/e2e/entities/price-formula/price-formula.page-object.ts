import { browser, ExpectedConditions as ec, element, by, ElementFinder } from 'protractor';

export class PriceFormulaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-price-formula div table .ui-button-danger'));
  title = element.all(by.css('jhi-price-formula div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class PriceFormulaUpdatePage {
  pageTitle = element(by.id('jhi-price-formula-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  maxInput = element(by.id('field_max'));
  formulaInput = element(by.id('field_formula'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setMaxInput(max) {
    await this.maxInput.sendKeys(max);
  }

  async getMaxInput() {
    return await this.maxInput.getAttribute('value');
  }

  async setFormulaInput(formula) {
    await this.formulaInput.sendKeys(formula);
  }

  async getFormulaInput() {
    return await this.formulaInput.getAttribute('value');
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class PriceFormulaDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
