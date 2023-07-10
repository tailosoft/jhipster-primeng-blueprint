import chalk from 'chalk';
import LanguagesGenerator from 'generator-jhipster/generators/languages';

export default class extends LanguagesGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints primeng-blueprint')}`
      );
    }
  }

  get [LanguagesGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [LanguagesGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      async promptingTemplateTask() {},
    };
  }

  get [LanguagesGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
      async configuringTemplateTask() {},
    };
  }

  get [LanguagesGenerator.COMPOSING]() {
    return {
      ...super.composing,
      async composingTemplateTask() {},
    };
  }

  get [LanguagesGenerator.LOADING]() {
    return {
      ...super.loading,
      async loadingTemplateTask() {},
    };
  }

  get [LanguagesGenerator.PREPARING]() {
    return {
      ...super.preparing,
      async preparingTemplateTask() {},
    };
  }

  get [LanguagesGenerator.CONFIGURING_EACH_ENTITY]() {
    return {
      ...super.configuringEachEntity,
      async configuringEachEntityTemplateTask() {},
    };
  }

  get [LanguagesGenerator.LOADING_ENTITIES]() {
    return {
      ...super.loadingEntities,
      async loadingEntitiesTemplateTask() {},
    };
  }

  get [LanguagesGenerator.PREPARING_EACH_ENTITY]() {
    return {
      ...super.preparingEachEntity,
      async preparingEachEntityTemplateTask() {},
    };
  }

  get [LanguagesGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return {
      ...super.preparingEachEntityField,
      async preparingEachEntityFieldTemplateTask() {},
    };
  }

  get [LanguagesGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      ...super.preparingEachEntityRelationship,
      async preparingEachEntityRelationshipTemplateTask() {},
    };
  }

  get [LanguagesGenerator.POST_PREPARING_EACH_ENTITY]() {
    return {
      ...super.postPreparingEachEntity,
      async postPreparingEachEntityTemplateTask() {},
    };
  }

  get [LanguagesGenerator.DEFAULT]() {
    return {
      ...super.default,
      async defaultTemplateTask() {},
    };
  }

  get [LanguagesGenerator.WRITING]() {
    return {
      ...super.writing,
    };
  }

  get [LanguagesGenerator.WRITING_ENTITIES]() {
    return {
      ...super.writingEntities,
      async writingEntitiesTemplateTask() {},
    };
  }

  get [LanguagesGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [LanguagesGenerator.POST_WRITING_ENTITIES]() {
    return {
      ...super.postWritingEntities,
      async postWritingEntitiesTemplateTask() {},
    };
  }

  get [LanguagesGenerator.INSTALL]() {
    return {
      ...super.install,
      async installTemplateTask() {},
    };
  }

  get [LanguagesGenerator.POST_INSTALL]() {
    return {
      ...super.postInstall,
      async postInstallTemplateTask() {},
    };
  }

  get [LanguagesGenerator.END]() {
    return {
      ...super.end,
      async endTemplateTask() {},
    };
  }
}
