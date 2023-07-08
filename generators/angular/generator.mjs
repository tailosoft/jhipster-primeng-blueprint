import chalk from 'chalk';
import AngularGenerator from 'generator-jhipster/generators/angular';

export default class extends AngularGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints primeng-blueprint')}`
      );
    }
  }

  get [AngularGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [AngularGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      async promptingTemplateTask() {},
    };
  }

  get [AngularGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
      async configuringTemplateTask() {},
    };
  }

  get [AngularGenerator.COMPOSING]() {
    return {
      ...super.composing,
      async composingTemplateTask() {},
    };
  }

  get [AngularGenerator.LOADING]() {
    return {
      ...super.loading,
      async loadingTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING]() {
    return {
      ...super.preparing,
      async preparingTemplateTask() {},
    };
  }

  get [AngularGenerator.CONFIGURING_EACH_ENTITY]() {
    return {
      ...super.configuringEachEntity,
      async configuringEachEntityTemplateTask() {},
    };
  }

  get [AngularGenerator.LOADING_ENTITIES]() {
    return {
      ...super.loadingEntities,
      async loadingEntitiesTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY]() {
    return {
      ...super.preparingEachEntity,
      async preparingEachEntityTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return {
      ...super.preparingEachEntityField,
      async preparingEachEntityFieldTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      ...super.preparingEachEntityRelationship,
      async preparingEachEntityRelationshipTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_PREPARING_EACH_ENTITY]() {
    return {
      ...super.postPreparingEachEntity,
      async postPreparingEachEntityTemplateTask() {},
    };
  }

  get [AngularGenerator.DEFAULT]() {
    return {
      ...super.default,
      async defaultTemplateTask() {},
    };
  }

  get [AngularGenerator.WRITING]() {
    return {
      ...super.writing,
      async writingTemplateTask() {
        await this.writeFiles({
          sections: {
            files: [{ templates: ['template-file-angular'] }],
          },
          context: this,
        });
      },
    };
  }

  get [AngularGenerator.WRITING_ENTITIES]() {
    return {
      ...super.writingEntities,
      async writingEntitiesTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_WRITING_ENTITIES]() {
    return {
      ...super.postWritingEntities,
      async postWritingEntitiesTemplateTask() {},
    };
  }

  get [AngularGenerator.INSTALL]() {
    return {
      ...super.install,
      async installTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_INSTALL]() {
    return {
      ...super.postInstall,
      async postInstallTemplateTask() {},
    };
  }

  get [AngularGenerator.END]() {
    return {
      ...super.end,
      async endTemplateTask() {},
    };
  }
}
