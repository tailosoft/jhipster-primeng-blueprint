import { browser, ExpectedConditions as ec, element, by, ElementFinder } from 'protractor';

export class TaskCommentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-task-comment div table .ui-button-danger'));
  title = element.all(by.css('jhi-task-comment div h2#page-heading span')).first();

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

export class TaskCommentUpdatePage {
  pageTitle = element(by.id('jhi-task-comment-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  idInput = element(by.id('field_id'));
  valueInput = element(by.id('field_value'));
  taskSelect = element(by.id('field_task'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setInput(id) {
    await this.idInput.sendKeys(id);
  }

  async getInput() {
    return await this.idInput.getAttribute('value');
  }

  async setValueInput(value) {
    await this.valueInput.sendKeys(value);
  }

  async getValueInput() {
    return await this.valueInput.getAttribute('value');
  }

  async taskSelectLastOption(timeout?: number) {
    await this.taskSelect.click();
    await this.taskSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
    await browser.wait(ec.invisibilityOf(this.taskSelect.element(by.css('.ui-dropdown-panel'))), 5000);
  }

  getTaskSelect(): ElementFinder {
    return this.taskSelect;
  }

  async getTaskSelectedOption() {
    return await this.taskSelect.element(by.css('.ui-dropdown-label')).getText();
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

export class TaskCommentDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
