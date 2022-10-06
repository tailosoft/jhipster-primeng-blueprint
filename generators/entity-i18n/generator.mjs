import chalk from 'chalk';
import EntityI18NGenerator from 'generator-jhipster/generators/entity-i18n/index.js';
import { writeFiles } from './files.js';

export default class extends EntityI18NGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints test-blueprint')}`);
    }
  }

  get [EntityI18NGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      async promptingTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
      async configuringTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.COMPOSING]() {
    return {
      ...super.composing,
      async composingTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.LOADING]() {
    return {
      ...super.loading,
      async loadingTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.PREPARING]() {
    return {
      ...super.preparing,
      async preparingTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.PREPARING_FIELDS]() {
    return {
      ...super.preparingFields,
      async preparingFieldsTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.PREPARING_RELATIONSHIPS]() {
    return {
      ...super.preparingRelationships,
      async preparingRelationshipsTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.DEFAULT]() {
    return {
      ...super.default,
      async defaultTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.WRITING]() {
    return {
      ...super.writing,
      // TODO set fields so that composite fields are not translated
      writeFiles
    };
  }

  get [EntityI18NGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.INSTALL]() {
    return {
      ...super.install,
      async installTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.POST_INSTALL]() {
    return {
      ...super.postInstall,
      async postInstallTemplateTask() {},
    };
  }

  get [EntityI18NGenerator.END]() {
    return {
      ...super.end,
      async endTemplateTask() {},
    };
  }
}
