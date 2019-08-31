import { browser, ExpectedConditions as ec, element, by, ElementFinder } from 'protractor';

export class EmployeeSkillCertificateComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-employee-skill-certificate div table .ui-button-danger'));
  title = element.all(by.css('jhi-employee-skill-certificate div h2#page-heading span')).first();

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

export class EmployeeSkillCertificateUpdatePage {
  pageTitle = element(by.id('jhi-employee-skill-certificate-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  gradeInput = element(by.id('field_grade'));
  dateInput = element(by.id('field_date'));
  typeSelect = element(by.id('field_type'));
  skillSelect = element(by.id('field_skill'));
  skillEmployeeSelect = element(by.id('field_skillEmployee'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setGradeInput(grade) {
    await this.gradeInput.sendKeys(grade);
  }

  async getGradeInput() {
    return await this.gradeInput.getAttribute('value');
  }

  async setDateInput(date) {
    await this.dateInput.element(by.css('.ui-inputtext')).sendKeys(date);
    await this.dateInput.element(by.tagName('.ui-calendar-button')).click();
    await browser.wait(ec.invisibilityOf(this.dateInput.element(by.css('.ui-datepicker'))), 5000);
  }

  async getDateInput() {
    return await this.dateInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  async typeSelectLastOption(timeout?: number) {
    await this.typeSelect.click();
    await this.typeSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
    await browser.wait(ec.invisibilityOf(this.typeSelect.element(by.css('.ui-dropdown-panel'))), 5000);
  }

  getTypeSelect(): ElementFinder {
    return this.typeSelect;
  }

  async getTypeSelectedOption() {
    return await this.typeSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async skillSelectLastOption(timeout?: number) {
    await this.skillSelect.click();
    await this.skillSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
    await browser.wait(ec.invisibilityOf(this.skillSelect.element(by.css('.ui-dropdown-panel'))), 5000);
  }

  getSkillSelect(): ElementFinder {
    return this.skillSelect;
  }

  async getSkillSelectedOption() {
    return await this.skillSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async skillEmployeeSelectLastOption(timeout?: number) {
    await this.skillEmployeeSelect.click();
    await this.skillEmployeeSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
    await browser.wait(ec.invisibilityOf(this.skillEmployeeSelect.element(by.css('.ui-dropdown-panel'))), 5000);
  }

  getSkillEmployeeSelect(): ElementFinder {
    return this.skillEmployeeSelect;
  }

  async getSkillEmployeeSelectedOption() {
    return await this.skillEmployeeSelect.element(by.css('.ui-dropdown-label')).getText();
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

export class EmployeeSkillCertificateDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
