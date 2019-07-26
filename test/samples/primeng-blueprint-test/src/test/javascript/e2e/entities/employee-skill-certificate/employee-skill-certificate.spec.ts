/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EmployeeSkillCertificateComponentsPage, EmployeeSkillCertificateUpdatePage } from './employee-skill-certificate.page-object';

const expect = chai.expect;

describe('EmployeeSkillCertificate e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let employeeSkillCertificateUpdatePage: EmployeeSkillCertificateUpdatePage;
  let employeeSkillCertificateComponentsPage: EmployeeSkillCertificateComponentsPage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load EmployeeSkillCertificates', async () => {
    await navBarPage.goToEntity('employee-skill-certificate');
    employeeSkillCertificateComponentsPage = new EmployeeSkillCertificateComponentsPage();
    await browser.wait(ec.visibilityOf(employeeSkillCertificateComponentsPage.title), 5000);
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
        await promise.all([
            employeeSkillCertificateUpdatePage.setGradeInput('5'),
            employeeSkillCertificateUpdatePage.setDateInput('2000-12-31'),
            employeeSkillCertificateUpdatePage.typeSelectLastOption(),
            employeeSkillCertificateUpdatePage.skillSelectLastOption(),
        ]);
        expect(await employeeSkillCertificateUpdatePage.getGradeInput()).to.eq('5', 'Expected grade value to be equals to 5');
        expect(await employeeSkillCertificateUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
        await employeeSkillCertificateUpdatePage.save();
        expect(await employeeSkillCertificateUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await employeeSkillCertificateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    });*/

  /* it('should delete last EmployeeSkillCertificate', async () => {
        // TODO test delete dialog e2e
});*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
