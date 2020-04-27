import { browser } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TaskComponentsPage, TaskDeleteDialog, TaskUpdatePage } from './task.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Task e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let taskComponentsPage: TaskComponentsPage;
  let taskUpdatePage: TaskUpdatePage;
  let taskDeleteDialog: TaskDeleteDialog;
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
  });

  it('should load Tasks', async () => {
    await navBarPage.goToEntity('task');
    taskComponentsPage = new TaskComponentsPage();
    expect(await taskComponentsPage.getTitle()).to.eq('primengtestApp.task.home.title');
  });

  it('should load create Task page', async () => {
    await taskComponentsPage.clickOnCreateButton();
    taskUpdatePage = new TaskUpdatePage();
    expect(await taskUpdatePage.getPageTitle()).to.eq('primengtestApp.task.home.createOrEditLabel');
    await taskUpdatePage.cancel();
  });

  it('should create and save Tasks', async () => {
    const nbButtonsBeforeCreate = await taskComponentsPage.countDeleteButtons();

    await taskComponentsPage.clickOnCreateButton();
    await taskUpdatePage.setNameInput('name');
    await taskUpdatePage.typeSelectLastOption();
    await taskUpdatePage.setEndDateInput('12/31/2000');
    await taskUpdatePage.setCreatedAtInput('01/01/2001 02:30');
    await taskUpdatePage.setModifiedAtInput('01/01/2001 02:30');
    const doneBeforeClick = await taskUpdatePage.isDoneInputSelected();
    await taskUpdatePage.getDoneInput().click();
    await taskUpdatePage.setDescriptionInput('description');
    await taskUpdatePage.setAttachmentInput(absolutePath);
    await taskUpdatePage.setPictureInput(absolutePath);
    expect(await taskUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await taskUpdatePage.getEndDateInput()).to.eq('12/31/2000', 'Expected endDate value to be equals to 12/31/2000');
    expect(await taskUpdatePage.getCreatedAtInput()).to.contain(
      '01/01/2001 02:30',
      'Expected createdAt value to be equals to 01/01/2001 02:30'
    );
    expect(await taskUpdatePage.getModifiedAtInput()).to.contain(
      '01/01/2001 02:30',
      'Expected modifiedAt value to be equals to 01/01/2001 02:30'
    );
    expect(await taskUpdatePage.isDoneInputSelected(), 'Expected done to change after click').to.eq(!doneBeforeClick);
    expect(await taskUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
    expect(await taskUpdatePage.getAttachmentInput()).to.endsWith(
      fileNameToUpload,
      'Expected Attachment value to be end with ' + fileNameToUpload
    );
    expect(await taskUpdatePage.getPictureInput()).to.endsWith(
      fileNameToUpload,
      'Expected Picture value to be end with ' + fileNameToUpload
    );

    await taskUpdatePage.save();
    expect(await taskUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await taskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Task', async () => {
    const nbButtonsBeforeDelete = await taskComponentsPage.countDeleteButtons();
    await taskComponentsPage.clickOnLastDeleteButton();

    taskDeleteDialog = new TaskDeleteDialog();
    await taskDeleteDialog.clickOnConfirmButton();

    expect(await taskComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
