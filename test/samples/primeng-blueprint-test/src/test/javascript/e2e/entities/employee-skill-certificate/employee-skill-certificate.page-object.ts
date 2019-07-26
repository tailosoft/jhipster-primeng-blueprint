import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class EmployeeSkillCertificateComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-employee-skill-certificate div table .btn-danger'));
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
    await this.dateInput.sendKeys(date);
  }

  async getDateInput() {
    return await this.dateInput.getAttribute('value');
  }

  async typeSelectLastOption(timeout?: number) {
    await this.typeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async typeSelectOption(option) {
    await this.typeSelect.sendKeys(option);
  }

  getTypeSelect(): ElementFinder {
    return this.typeSelect;
  }

  async getTypeSelectedOption() {
    return await this.typeSelect.element(by.css('option:checked')).getText();
  }

  async skillSelectLastOption(timeout?: number) {
    await this.skillSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async skillSelectOption(option) {
    await this.skillSelect.sendKeys(option);
  }

  getSkillSelect(): ElementFinder {
    return this.skillSelect;
  }

  async getSkillSelectedOption() {
    return await this.skillSelect.element(by.css('option:checked')).getText();
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
