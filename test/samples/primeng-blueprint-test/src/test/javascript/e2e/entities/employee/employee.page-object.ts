import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class EmployeeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-employee div table .ui-button-danger'));
  title = element.all(by.css('jhi-employee div h2#page-heading span')).first();

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

export class EmployeeUpdatePage {
  pageTitle = element(by.id('jhi-employee-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  usernameInput = element(by.id('field_username'));
  fullnameInput = element(by.id('field_fullname'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setUsernameInput(username) {
    await this.usernameInput.sendKeys(username);
  }

  async getUsernameInput() {
    return await this.usernameInput.getAttribute('value');
  }

  async setFullnameInput(fullname) {
    await this.fullnameInput.sendKeys(fullname);
  }

  async getFullnameInput() {
    return await this.fullnameInput.getAttribute('value');
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

export class EmployeeDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
