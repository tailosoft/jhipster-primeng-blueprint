import { browser } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  EmployeeSkillCertificateComponentsPage,
  /* EmployeeSkillCertificateDeleteDialog, */
  EmployeeSkillCertificateUpdatePage
} from './employee-skill-certificate.page-object';

const expect = chai.expect;

describe('EmployeeSkillCertificate e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let employeeSkillCertificateComponentsPage: EmployeeSkillCertificateComponentsPage;
  let employeeSkillCertificateUpdatePage: EmployeeSkillCertificateUpdatePage;
  /* let employeeSkillCertificateDeleteDialog: EmployeeSkillCertificateDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
  });

  it('should load EmployeeSkillCertificates', async () => {
    await navBarPage.goToEntity('employee-skill-certificate');
    employeeSkillCertificateComponentsPage = new EmployeeSkillCertificateComponentsPage();
    expect(await employeeSkillCertificateComponentsPage.getTitle()).to.eq('primengtestApp.employeeSkillCertificate.home.title');
  });

  it('should load create EmployeeSkillCertificate page', async () => {
    await employeeSkillCertificateComponentsPage.clickOnCreateButton();
    employeeSkillCertificateUpdatePage = new EmployeeSkillCertificateUpdatePage();
    expect(await employeeSkillCertificateUpdatePage.getPageTitle()).to.eq('primengtestApp.employeeSkillCertificate.home.createOrEditLabel');
    await employeeSkillCertificateUpdatePage.cancel();
  });

  /* it('should create and save EmployeeSkillCertificates', async () => {
        const nbButtonsBeforeCreate = await employeeSkillCertificateComponentsPage.countDeleteButtons();

        await employeeSkillCertificateComponentsPage.clickOnCreateButton();
        await employeeSkillCertificateUpdatePage.setGradeInput('9999999');
        await employeeSkillCertificateUpdatePage.setDateInput('12/31/2000');
        await employeeSkillCertificateUpdatePage.typeSelectLastOption();
        await employeeSkillCertificateUpdatePage.skillSelectLastOption();
        await employeeSkillCertificateUpdatePage.skillEmployeeSelectLastOption();
        expect(await employeeSkillCertificateUpdatePage.getGradeInput()).to.eq('9999999', 'Expected grade value to be equals to 9999999');
        expect(await employeeSkillCertificateUpdatePage.getDateInput()).to.eq('12/31/2000', 'Expected date value to be equals to 12/31/2000');

        await employeeSkillCertificateUpdatePage.save();
        expect(await employeeSkillCertificateUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await employeeSkillCertificateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last EmployeeSkillCertificate', async () => {
        const nbButtonsBeforeDelete = await employeeSkillCertificateComponentsPage.countDeleteButtons();
        await employeeSkillCertificateComponentsPage.clickOnLastDeleteButton();

        employeeSkillCertificateDeleteDialog = new EmployeeSkillCertificateDeleteDialog();
        await employeeSkillCertificateDeleteDialog.clickOnConfirmButton();

        expect(await employeeSkillCertificateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
