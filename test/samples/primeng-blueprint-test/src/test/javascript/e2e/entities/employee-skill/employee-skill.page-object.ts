import { browser, ExpectedConditions as ec, element, by, ElementFinder } from 'protractor';

export class EmployeeSkillComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-employee-skill div table .ui-button-danger'));
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
  taskSelect = element(by.id('field_tasks'));
  employeeSelect = element(by.id('field_employee'));
  teacherSelect = element(by.id('field_teacher'));

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
    await this.taskSelect.click();
    await this.taskSelect
      .all(by.tagName('.ui-multiselect-item'))
      .last()
      .click();
    await this.taskSelect.element(by.css('.ui-multiselect-close')).click();
    await browser.wait(ec.invisibilityOf(this.taskSelect.element(by.css('.ui-multiselect-panel'))), 5000);
  }

  getTaskSelect(): ElementFinder {
    return this.taskSelect;
  }

  async getTaskSelectedOption() {
    return await this.taskSelect.element(by.css('.ui-multiselect-label')).getText();
  }

  async employeeSelectLastOption(timeout?: number) {
    await this.employeeSelect.click();
    await this.employeeSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
    await browser.wait(ec.invisibilityOf(this.employeeSelect.element(by.css('.ui-dropdown-panel'))), 5000);
  }

  getEmployeeSelect(): ElementFinder {
    return this.employeeSelect;
  }

  async getEmployeeSelectedOption() {
    return await this.employeeSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async teacherSelectLastOption(timeout?: number) {
    await this.teacherSelect.click();
    await this.teacherSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
    await browser.wait(ec.invisibilityOf(this.teacherSelect.element(by.css('.ui-dropdown-panel'))), 5000);
  }

  getTeacherSelect(): ElementFinder {
    return this.teacherSelect;
  }

  async getTeacherSelectedOption() {
    return await this.teacherSelect.element(by.css('.ui-dropdown-label')).getText();
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

export class EmployeeSkillDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
