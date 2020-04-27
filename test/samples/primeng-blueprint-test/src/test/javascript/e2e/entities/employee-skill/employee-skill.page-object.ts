import { element, by, ElementFinder } from 'protractor';

export class EmployeeSkillComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-employee-skill div table .ui-button-danger'));
  title = element.all(by.css('jhi-employee-skill div h2#page-heading span')).first();

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

export class EmployeeSkillUpdatePage {
  pageTitle = element(by.id('jhi-employee-skill-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nameInput = element(by.id('field_name'));
  levelInput = element(by.id('field_level'));

  taskSelect = element(by.id('field_tasks'));
  employeeSelect = element(by.id('field_employee'));
  teacherSelect = element(by.id('field_teacher'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setLevelInput(level: string): Promise<void> {
    await this.levelInput.sendKeys(level);
  }

  async getLevelInput(): Promise<string> {
    return await this.levelInput.getAttribute('value');
  }

  async taskSelectLastOption(): Promise<void> {
    await this.taskSelect.click();
    await this.taskSelect
      .all(by.tagName('.ui-multiselect-item'))
      .last()
      .click();
    await this.taskSelect.element(by.css('.ui-multiselect-close')).click();
  }

  getTaskSelect(): ElementFinder {
    return this.taskSelect;
  }

  async getTaskSelectedOption(): Promise<string> {
    return await this.taskSelect.element(by.css('.ui-multiselect-label')).getText();
  }
  async employeeSelectLastOption(): Promise<void> {
    await this.employeeSelect.click();
    await this.employeeSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
  }

  getEmployeeSelect(): ElementFinder {
    return this.employeeSelect;
  }

  async getEmployeeSelectedOption(): Promise<string> {
    return await this.employeeSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async teacherSelectLastOption(): Promise<void> {
    await this.teacherSelect.click();
    await this.teacherSelect
      .all(by.tagName('.ui-dropdown-item'))
      .last()
      .click();
  }

  getTeacherSelect(): ElementFinder {
    return this.teacherSelect;
  }

  async getTeacherSelectedOption(): Promise<string> {
    return await this.teacherSelect.element(by.css('.ui-dropdown-label')).getText();
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

export class EmployeeSkillDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
