import { browser, ExpectedConditions as ec, element, by, ElementFinder } from 'protractor';

export class TaskComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-task div table .ui-button-danger'));
  title = element.all(by.css('jhi-task div h2#page-heading span')).first();

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

export class TaskUpdatePage {
  pageTitle = element(by.id('jhi-task-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  typeSelect = element(by.id('field_type'));
  endDateInput = element(by.id('field_endDate'));
  createdAtInput = element(by.id('field_createdAt'));
  modifiedAtInput = element(by.id('field_modifiedAt'));
  doneInput = element(by.id('field_done'));
  descriptionInput = element(by.id('field_description'));
  attachmentInput = element(by.id('field_attachment'));
  pictureInput = element(by.id('field_picture'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setInput(id) {
    await this.idInput.sendKeys(id);
  }

  async getInput() {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return await this.nameInput.getAttribute('value');
  }

  async typeSelectLastOption(timeout?: number) {
    await this.typeSelect.click();
    await this.typeSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
    await browser.wait(ec.invisibilityOf(this.typeSelect.element(by.css('.ui-dropdown-panel'))), 5000);
  }

  async getTypeSelect() {
    return await this.typeSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async setEndDateInput(endDate) {
    await this.endDateInput.element(by.css('.ui-inputtext')).sendKeys(endDate);
    await this.endDateInput.element(by.tagName('.ui-calendar-button')).click();
    await browser.wait(ec.invisibilityOf(this.endDateInput.element(by.css('.ui-datepicker'))), 5000);
  }

  async getEndDateInput() {
    return await this.endDateInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  async setCreatedAtInput(createdAt) {
    await this.createdAtInput.element(by.css('.ui-inputtext')).sendKeys(createdAt);
    await this.createdAtInput.element(by.tagName('.ui-calendar-button')).click();
    await browser.wait(ec.invisibilityOf(this.createdAtInput.element(by.css('.ui-datepicker'))), 5000);
  }

  async getCreatedAtInput() {
    return await this.createdAtInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  async setModifiedAtInput(modifiedAt) {
    await this.modifiedAtInput.element(by.css('.ui-inputtext')).sendKeys(modifiedAt);
    await this.modifiedAtInput.element(by.tagName('.ui-calendar-button')).click();
    await browser.wait(ec.invisibilityOf(this.modifiedAtInput.element(by.css('.ui-datepicker'))), 5000);
  }

  async getModifiedAtInput() {
    return await this.modifiedAtInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  getDoneInput(timeout?: number) {
    return this.doneInput;
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return await this.descriptionInput.getAttribute('value');
  }

  async setAttachmentInput(attachment) {
    await this.attachmentInput.element(by.css('input[type="file"]')).sendKeys(attachment);
  }

  async getAttachmentInput() {
    return await this.attachmentInput
      .all(by.css('.ui-fileupload-row > div'))
      .get(1)
      .getText();
  }

  async setPictureInput(picture) {
    await this.pictureInput.element(by.css('input[type="file"]')).sendKeys(picture);
  }

  async getPictureInput() {
    return await this.pictureInput
      .all(by.css('.ui-fileupload-row > div'))
      .get(1)
      .getText();
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

export class TaskDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
