/* tslint:disable no-unused-expression */
import { browser, by, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EmployeeSkillComponentsPage, EmployeeSkillDeleteDialog, EmployeeSkillUpdatePage } from './employee-skill.page-object';

const expect = chai.expect;

describe('EmployeeSkill e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let employeeSkillUpdatePage: EmployeeSkillUpdatePage;
  let employeeSkillComponentsPage: EmployeeSkillComponentsPage;
  /*let employeeSkillDeleteDialog: EmployeeSkillDeleteDialog;*/

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load EmployeeSkills', async () => {
    await navBarPage.goToEntity('employee-skill');
    employeeSkillComponentsPage = new EmployeeSkillComponentsPage();
    await browser.wait(ec.visibilityOf(employeeSkillComponentsPage.title), 5000);
    expect(await employeeSkillComponentsPage.getTitle()).to.eq('primengtestApp.employeeSkill.home.title');
  });

  it('should load create EmployeeSkill page', async () => {
    await employeeSkillComponentsPage.clickOnCreateButton();
    employeeSkillUpdatePage = new EmployeeSkillUpdatePage();
    expect(await employeeSkillUpdatePage.getPageTitle()).to.eq('primengtestApp.employeeSkill.home.createOrEditLabel');
    await employeeSkillUpdatePage.cancel();
  });

  /* it('should create and save EmployeeSkills', async () => {
        const nbButtonsBeforeCreate = await employeeSkillComponentsPage.countDeleteButtons();

        await employeeSkillComponentsPage.clickOnCreateButton();
        await employeeSkillUpdatePage.setNameInput('name');
        await employeeSkillUpdatePage.setLevelInput('5');
        // await employeeSkillUpdatePage.taskSelectLastOption();
        await employeeSkillUpdatePage.employeeSelectLastOption();
        await employeeSkillUpdatePage.teacherSelectLastOption();
        expect(await employeeSkillUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
        expect(await employeeSkillUpdatePage.getLevelInput()).to.eq('5', 'Expected level value to be equals to 5');
        await employeeSkillUpdatePage.save();
        expect(await employeeSkillUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await employeeSkillComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    });*/

  /* it('should delete last EmployeeSkill', async () => {
        const nbButtonsBeforeDelete = await employeeSkillComponentsPage.countDeleteButtons();
        await employeeSkillComponentsPage.clickOnLastDeleteButton();

        employeeSkillDeleteDialog = new EmployeeSkillDeleteDialog();
        await employeeSkillDeleteDialog.clickOnConfirmButton();

        expect(await employeeSkillComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
