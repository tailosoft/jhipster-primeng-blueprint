import chalk from 'chalk';
import CypressGenerator from 'generator-jhipster/generators/cypress/index.js';

export default class extends CypressGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints test-blueprint')}`);
    }
  }

  get [CypressGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [CypressGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      async promptingTemplateTask() {},
    };
  }

  get [CypressGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
      async configuringTemplateTask() {},
    };
  }

  get [CypressGenerator.COMPOSING]() {
    return {
      ...super.composing,
      async composingTemplateTask() {},
    };
  }

  get [CypressGenerator.LOADING]() {
    return {
      ...super.loading,
      async loadingTemplateTask() {},
    };
  }

  get [CypressGenerator.PREPARING]() {
    return {
      ...super.preparing,
      async preparingTemplateTask() {},
    };
  }

  get [CypressGenerator.DEFAULT]() {
    return {
      ...super.default,
      async defaultTemplateTask() {},
    };
  }

  get [CypressGenerator.WRITING]() {
    return {
      ...super.writing,
      // jhipster automatically picks up blueprints files before falling back to its own
    };
  }

  get [CypressGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [CypressGenerator.INSTALL]() {
    return {
      ...super.install,
      async installTemplateTask() {},
    };
  }

  get [CypressGenerator.POST_INSTALL]() {
    return {
      ...super.postInstall,
      async postInstallTemplateTask() {},
    };
  }

  get [CypressGenerator.END]() {
    return {
      ...super.end,
      async endTemplateTask() {},
    };
  }
}
