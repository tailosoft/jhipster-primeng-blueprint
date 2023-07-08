import chalk from 'chalk';
import CypressGenerator from 'generator-jhipster/generators/cypress';

export default class extends CypressGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints primeng-blueprint')}`
      );
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

  get [CypressGenerator.CONFIGURING_EACH_ENTITY]() {
    return {
      ...super.configuringEachEntity,
      async configuringEachEntityTemplateTask() {},
    };
  }

  get [CypressGenerator.LOADING_ENTITIES]() {
    return {
      ...super.loadingEntities,
      async loadingEntitiesTemplateTask() {},
    };
  }

  get [CypressGenerator.PREPARING_EACH_ENTITY]() {
    return {
      ...super.preparingEachEntity,
      async preparingEachEntityTemplateTask() {},
    };
  }

  get [CypressGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return {
      ...super.preparingEachEntityField,
      async preparingEachEntityFieldTemplateTask() {},
    };
  }

  get [CypressGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      ...super.preparingEachEntityRelationship,
      async preparingEachEntityRelationshipTemplateTask() {},
    };
  }

  get [CypressGenerator.POST_PREPARING_EACH_ENTITY]() {
    return {
      ...super.postPreparingEachEntity,
      async postPreparingEachEntityTemplateTask() {},
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
      async writingTemplateTask() {
        await this.writeFiles({
          sections: {
            files: [{ templates: ['template-file-cypress'] }],
          },
          context: this,
        });
      },
    };
  }

  get [CypressGenerator.WRITING_ENTITIES]() {
    return {
      ...super.writingEntities,
      async writingEntitiesTemplateTask() {},
    };
  }

  get [CypressGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [CypressGenerator.POST_WRITING_ENTITIES]() {
    return {
      ...super.postWritingEntities,
      async postWritingEntitiesTemplateTask() {},
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
