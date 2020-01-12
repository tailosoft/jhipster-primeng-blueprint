import { browser, ExpectedConditions as ec, element, by, ElementFinder } from 'protractor';

export class EmployeeSkillCertificateComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-employee-skill-certificate div table .ui-button-danger'));
  title = element.all(by.css('jhi-employee-skill-certificate div h2#page-heading span')).first();

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

export class EmployeeSkillCertificateUpdatePage {
  pageTitle = element(by.id('jhi-employee-skill-certificate-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  gradeInput = element(by.id('field_grade'));
  dateInput = element(by.id('field_date'));
  typeSelect = element(by.id('field_type'));
  skillSelect = element(by.id('field_skill'));
  skillEmployeeSelect = element(by.id('field_skillEmployee'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setGradeInput(grade: string): Promise<void> {
    await this.gradeInput.sendKeys(grade);
  }

  async getGradeInput(): Promise<string> {
    return await this.gradeInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.element(by.css('.ui-inputtext')).sendKeys(date);
    await this.dateInput.element(by.tagName('.ui-calendar-button')).click();
    await browser.wait(ec.invisibilityOf(this.dateInput.element(by.css('.ui-datepicker'))), 5000);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.element(by.css('.ui-inputtext')).getAttribute('value');
  }

  async typeSelectLastOption(): Promise<void> {
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

  async getTypeSelectedOption(): Promise<string> {
    return await this.typeSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async skillSelectLastOption(): Promise<void> {
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

  async getSkillSelectedOption(): Promise<string> {
    return await this.skillSelect.element(by.css('.ui-dropdown-label')).getText();
  }

  async skillEmployeeSelectLastOption(): Promise<void> {
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

  async getSkillEmployeeSelectedOption(): Promise<string> {
    return await this.skillEmployeeSelect.element(by.css('.ui-dropdown-label')).getText();
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

export class EmployeeSkillCertificateDeleteDialog {
  private confirmButton = element(by.css('p-confirmdialog .ui-dialog-footer button:first-of-type'));

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
