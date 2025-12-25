import ClientGenerator from 'generator-jhipster/generators/client';

export default class extends ClientGenerator {
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

  get [ClientGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      ...super.initializing,
      async initializingTemplateTask() {},
    });
  }

  get [ClientGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,
      async promptingTemplateTask() {},
    });
  }

  get [ClientGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
      async configuringTemplateTask() {},
    });
  }

  get [ClientGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      ...super.composing,
      async composingTemplateTask() {},
    });
  }

  get [ClientGenerator.COMPOSING_COMPONENT]() {
    return this.asComposingComponentTaskGroup({
      ...super.composingComponent,
      async composingComponentTemplateTask() {},
    });
  }

  get [ClientGenerator.BOOTSTRAP_APPLICATION]() {
    return this.asBootstrapApplicationTaskGroup({
      ...super.bootstrapApplication,
      async bootstrapApplicationTemplateTask() {},
    });
  }

  get [ClientGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      ...super.loading,
      async loadingTemplateTask() {},
    });
  }

  get [ClientGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,
      async preparingTemplateTask() {},
    });
  }

  get [ClientGenerator.CONFIGURING_EACH_ENTITY]() {
    return this.asConfiguringEachEntityTaskGroup({
      ...super.configuringEachEntity,
      async configuringEachEntityTemplateTask() {},
    });
  }

  get [ClientGenerator.LOADING_ENTITIES]() {
    return this.asLoadingEntitiesTaskGroup({
      ...super.loadingEntities,
      async loadingEntitiesTemplateTask() {},
    });
  }

  get [ClientGenerator.PREPARING_EACH_ENTITY]() {
    return this.asPreparingEachEntityTaskGroup({
      ...super.preparingEachEntity,
      async preparingEachEntityTemplateTask() {},
    });
  }

  get [ClientGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return this.asPreparingEachEntityFieldTaskGroup({
      ...super.preparingEachEntityField,
      async preparingEachEntityFieldTemplateTask() {},
    });
  }

  get [ClientGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return this.asPreparingEachEntityRelationshipTaskGroup({
      ...super.preparingEachEntityRelationship,
      async preparingEachEntityRelationshipTemplateTask() {},
    });
  }

  get [ClientGenerator.POST_PREPARING_EACH_ENTITY]() {
    return this.asPostPreparingEachEntityTaskGroup({
      ...super.postPreparingEachEntity,
      async postPreparingEachEntityTemplateTask() {},
    });
  }

  get [ClientGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      ...super.default,
      defaultTemplateTask({ entities }) {
        for (const entity of entities) {
          const replaceDayjs = value => value.replace(/dayjs\(/g, 'new Date(');

          if (entity.tsSampleWithPartialData) {
            entity.tsSampleWithPartialData = replaceDayjs(entity.tsSampleWithPartialData);
          }
          if (entity.tsSampleWithRequiredData) {
            entity.tsSampleWithRequiredData = replaceDayjs(entity.tsSampleWithRequiredData);
          }
          if (entity.tsSampleWithFullData) {
            entity.tsSampleWithFullData = replaceDayjs(entity.tsSampleWithFullData);
          }
          if (entity.tsSampleWithNewData) {
            entity.tsSampleWithNewData = replaceDayjs(entity.tsSampleWithNewData);
          }
          if (entity.tsPrimaryKeySamples) {
            entity.tsPrimaryKeySamples = entity.tsPrimaryKeySamples.map(replaceDayjs);
          }
        }
      },
    });
  }

  get [ClientGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...super.writing,
    });
  }

  get [ClientGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      ...super.writingEntities,
      async writingEntitiesTemplateTask() {},
    });
  }

  get [ClientGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
      async postWritingTemplateTask() {},
    });
  }

  get [ClientGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      ...super.postWritingEntities,
      async postWritingEntitiesTemplateTask() {},
    });
  }

  get [ClientGenerator.LOADING_TRANSLATIONS]() {
    return this.asLoadingTranslationsTaskGroup({
      ...super.loadingTranslations,
      async loadingTranslationsTemplateTask() {},
    });
  }

  get [ClientGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      ...super.install,
      async installTemplateTask() {},
    });
  }

  get [ClientGenerator.POST_INSTALL]() {
    return this.asPostInstallTaskGroup({
      ...super.postInstall,
      async postInstallTemplateTask() {},
    });
  }

  get [ClientGenerator.END]() {
    return this.asEndTaskGroup({
      ...super.end,
      async endTemplateTask() {},
    });
  }
}
