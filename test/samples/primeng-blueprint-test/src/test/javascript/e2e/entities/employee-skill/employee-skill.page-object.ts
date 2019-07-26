import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class EmployeeSkillComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-employee-skill div table .btn-danger'));
  title = element.all(by.css('jhi-employee-skill div h2#page-heading span')).first();

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

export class EmployeeSkillUpdatePage {
  pageTitle = element(by.id('jhi-employee-skill-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  nameInput = element(by.id('field_name'));
  levelInput = element(by.id('field_level'));
  taskSelect = element(by.id('field_task'));
  employeeSelect = element(by.id('field_employee'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return await this.nameInput.getAttribute('value');
  }

  async setLevelInput(level) {
    await this.levelInput.sendKeys(level);
  }

  async getLevelInput() {
    return await this.levelInput.getAttribute('value');
  }

  async taskSelectLastOption(timeout?: number) {
    await this.taskSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async taskSelectOption(option) {
    await this.taskSelect.sendKeys(option);
  }

  getTaskSelect(): ElementFinder {
    return this.taskSelect;
  }

  async getTaskSelectedOption() {
    return await this.taskSelect.element(by.css('option:checked')).getText();
  }

  async employeeSelectLastOption(timeout?: number) {
    await this.employeeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async employeeSelectOption(option) {
    await this.employeeSelect.sendKeys(option);
  }

  getEmployeeSelect(): ElementFinder {
    return this.employeeSelect;
  }

  async getEmployeeSelectedOption() {
    return await this.employeeSelect.element(by.css('option:checked')).getText();
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
