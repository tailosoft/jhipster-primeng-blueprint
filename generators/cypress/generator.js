import CypressGenerator from 'generator-jhipster/generators/cypress';

export default class extends CypressGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,

      checkBlueprint: true,
      // Dropped it once migration is done.
      jhipster7Migration: true,
    });
  }

  async beforeQueue() {
    await super.beforeQueue();
  }

  get [CypressGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      ...super.initializing,
      async initializingTemplateTask() {},
    });
  }

  get [CypressGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,
      async promptingTemplateTask() {},
    });
  }

  get [CypressGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
      async configuringTemplateTask() {},
    });
  }

  get [CypressGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      ...super.composing,
      async composingTemplateTask() {},
    });
  }

  get [CypressGenerator.COMPOSING_COMPONENT]() {
    return this.asComposingComponentTaskGroup({
      ...super.composingComponent,
      async composingComponentTemplateTask() {},
    });
  }

  get [CypressGenerator.BOOTSTRAP_APPLICATION]() {
    return this.asBootstrapApplicationTaskGroup({
      ...super.bootstrapApplication,
      async bootstrapApplicationTemplateTask() {},
    });
  }

  get [CypressGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      ...super.loading,
      async loadingTemplateTask() {},
    });
  }

  get [CypressGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,
      async preparingTemplateTask() {},
    });
  }

  get [CypressGenerator.CONFIGURING_EACH_ENTITY]() {
    return this.asConfiguringEachEntityTaskGroup({
      ...super.configuringEachEntity,
      async configuringEachEntityTemplateTask() {},
    });
  }

  get [CypressGenerator.LOADING_ENTITIES]() {
    return this.asLoadingEntitiesTaskGroup({
      ...super.loadingEntities,
      async loadingEntitiesTemplateTask() {},
    });
  }

  get [CypressGenerator.PREPARING_EACH_ENTITY]() {
    return this.asPreparingEachEntityTaskGroup({
      ...super.preparingEachEntity,
      async preparingEachEntityTemplateTask() {},
    });
  }

  get [CypressGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return this.asPreparingEachEntityFieldTaskGroup({
      ...super.preparingEachEntityField,
      async preparingEachEntityFieldTemplateTask() {},
    });
  }

  get [CypressGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return this.asPreparingEachEntityRelationshipTaskGroup({
      ...super.preparingEachEntityRelationship,
      async preparingEachEntityRelationshipTemplateTask() {},
    });
  }

  get [CypressGenerator.POST_PREPARING_EACH_ENTITY]() {
    return this.asPostPreparingEachEntityTaskGroup({
      ...super.postPreparingEachEntity,
      async postPreparingEachEntityTemplateTask() {},
    });
  }

  get [CypressGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      ...super.default,
      async defaultTemplateTask() {},
    });
  }

  get [CypressGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...super.writing,
      async writingTemplateTask({ application }) {
        await this.writeFiles({
          sections: {
            files: [{ templates: ['template-file-cypress'] }],
          },
          context: application,
        });
      },
    });
  }

  get [CypressGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      ...super.writingEntities,
      async writingEntitiesTemplateTask() {},
    });
  }

  get [CypressGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
      async postWritingTemplateTask() {},
    });
  }

  get [CypressGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      ...super.postWritingEntities,
      async postWritingEntitiesTemplateTask() {},
    });
  }

  get [CypressGenerator.LOADING_TRANSLATIONS]() {
    return this.asLoadingTranslationsTaskGroup({
      ...super.loadingTranslations,
      async loadingTranslationsTemplateTask() {},
    });
  }

  get [CypressGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      ...super.install,
      async installTemplateTask() {},
    });
  }

  get [CypressGenerator.POST_INSTALL]() {
    return this.asPostInstallTaskGroup({
      ...super.postInstall,
      async postInstallTemplateTask() {},
    });
  }

  get [CypressGenerator.END]() {
    return this.asEndTaskGroup({
      ...super.end,
      async endTemplateTask() {},
    });
  }
}
