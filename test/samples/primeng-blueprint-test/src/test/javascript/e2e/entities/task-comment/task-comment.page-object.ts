import { element, by, ElementFinder } from 'protractor';

export class TaskCommentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-task-comment div table .ui-button-danger'));
  title = element.all(by.css('jhi-task-comment div h2#page-heading span')).first();

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

export class TaskCommentUpdatePage {
  pageTitle = element(by.id('jhi-task-comment-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  valueInput = element(by.id('field_value'));

  taskSelect = element(by.id('field_task'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setValueInput(value: string): Promise<void> {
    await this.valueInput.sendKeys(value);
  }

  async getValueInput(): Promise<string> {
    return await this.valueInput.getAttribute('value');
  }

  async taskSelectLastOption(): Promise<void> {
    await this.taskSelect.click();
    await this.taskSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
  }

  getTaskSelect(): ElementFinder {
    return this.taskSelect;
  }

  async getTaskSelectedOption(): Promise<string> {
    return await this.taskSelect.element(by.css('.ui-dropdown-label')).getText();
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

export class TaskCommentDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
