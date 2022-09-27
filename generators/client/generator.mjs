import chalk from 'chalk';
import ClientGenerator from 'generator-jhipster/generators/client';
import { writeFiles as writeAngularFiles } from './files-angular.js';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class extends ClientGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints test-blueprint')}`);
    }
  }

  get [ClientGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [ClientGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      async promptingTemplateTask() {},
    };
  }

  get [ClientGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
      async configuringTemplateTask() {},
    };
  }

  get [ClientGenerator.COMPOSING]() {
    return {
      ...super.composing,
      async composingTemplateTask() {},
    };
  }

  get [ClientGenerator.LOADING]() {
    return {
      ...super.loading,
      // copied from jhipster and replaced "this.fetchFromInstalledJHipster('client', " by path.join('__dirname', with __dirname defined as above since in module
      loadPackageJson() {
        // Load common client package.json into packageJson
        _.merge(
          this.dependabotPackageJson,
          this.fs.readJSON(path.join(__dirname, 'templates', 'common', 'package.json'))
        );
        // Load client package.json into packageJson
        const clientFramewok = this.application.clientFramework;
        _.merge(
          this.dependabotPackageJson,
          this.fs.readJSON(path.join(__dirname, 'templates', clientFramewok, 'package.json'))
        );
      },
    };
    // const loadingFromJhipster = { ...super.loading };
    // return Object.fromEntries(Object.entries(loadingFromJhipster).map(([k, v]) => k === 'loadPackageJson' ? v.bind(this) : v));
    // return loadingFromJhipster;
  }

  get [ClientGenerator.PREPARING]() {
    return {
      ...super.preparing,
      async preparingTemplateTask() {},
    };
  }

  get [ClientGenerator.DEFAULT]() {
    return {
      ...super.default,
      async defaultTemplateTask() {},
    };
  }

  get [ClientGenerator.WRITING]() {
    return {
      ...super.writing,
      writeAngularFiles
    };
  }

  get [ClientGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [ClientGenerator.INSTALL]() {
    return {
      ...super.install,
      async installTemplateTask() {},
    };
  }

  get [ClientGenerator.END]() {
    return {
      ...super.end,
      async endTemplateTask() {},
    };
  }
}
