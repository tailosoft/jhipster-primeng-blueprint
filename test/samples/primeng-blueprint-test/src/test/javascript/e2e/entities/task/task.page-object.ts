import { element, by, ElementFinder, protractor } from 'protractor';

export class TaskComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-task div table .ui-button-danger'));
  title = element.all(by.css('jhi-task div h2#page-heading span')).first();

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

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect.click();
    await this.typeSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
  }

  async getTypeSelect(): Promise<string> {
    return await this.typeSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async setEndDateInput(endDate: string): Promise<void> {
    await this.endDateInput.element(by.css('.ui-inputtext')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    await this.endDateInput.element(by.css('.ui-inputtext')).sendKeys(endDate);
    await this.endDateInput.element(by.css('.ui-inputtext')).sendKeys(protractor.Key.ESCAPE);
  }

  async getEndDateInput(): Promise<string> {
    return await this.endDateInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  async setCreatedAtInput(createdAt: string): Promise<void> {
    await this.createdAtInput.element(by.css('.ui-inputtext')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    await this.createdAtInput.element(by.css('.ui-inputtext')).sendKeys(createdAt);
    await this.createdAtInput.element(by.css('.ui-inputtext')).sendKeys(protractor.Key.ESCAPE);
  }

  async getCreatedAtInput(): Promise<string> {
    return await this.createdAtInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  async setModifiedAtInput(modifiedAt: string): Promise<void> {
    await this.modifiedAtInput.element(by.css('.ui-inputtext')).sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    await this.modifiedAtInput.element(by.css('.ui-inputtext')).sendKeys(modifiedAt);
    await this.modifiedAtInput.element(by.css('.ui-inputtext')).sendKeys(protractor.Key.ESCAPE);
  }

  async getModifiedAtInput(): Promise<string> {
    return await this.modifiedAtInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  getDoneInput(): ElementFinder {
    return this.doneInput;
  }

  isDoneInputSelected(): Promise<boolean> {
    return this.getDoneInput()
      .element(by.css('input[type="checkbox"]'))
      .isSelected() as Promise<boolean>;
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setAttachmentInput(attachment: string): Promise<void> {
    await this.attachmentInput.element(by.css('input[type="file"]')).sendKeys(attachment);
  }

  async getAttachmentInput(): Promise<string> {
    return await this.attachmentInput
      .all(by.css('.ui-fileupload-row > div'))
      .get(1)
      .getText();
  }

  async setPictureInput(picture: string): Promise<void> {
    await this.pictureInput.element(by.css('input[type="file"]')).sendKeys(picture);
  }

  async getPictureInput(): Promise<string> {
    return await this.pictureInput
      .all(by.css('.ui-fileupload-row > div'))
      .get(1)
      .getText();
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

export class TaskDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
