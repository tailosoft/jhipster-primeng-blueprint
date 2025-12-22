import AngularGenerator from 'generator-jhipster/generators/angular';

export default class extends AngularGenerator {
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

  get [AngularGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      ...super.initializing,
      async initializingTemplateTask() {},
    });
  }

  get [AngularGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,
      async promptingTemplateTask() {},
    });
  }

  get [AngularGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
      async configuringTemplateTask() {},
    });
  }

  get [AngularGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      ...super.composing,
      async composingTemplateTask() {},
    });
  }

  get [AngularGenerator.COMPOSING_COMPONENT]() {
    return this.asComposingComponentTaskGroup({
      ...super.composingComponent,
      async composingComponentTemplateTask() {},
    });
  }

  get [AngularGenerator.BOOTSTRAP_APPLICATION]() {
    return this.asBootstrapApplicationTaskGroup({
      ...super.bootstrapApplication,
      async bootstrapApplicationTemplateTask() {},
    });
  }

  get [AngularGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      ...super.loading,
      async loadingTemplateTask() {},
    });
  }

  get [AngularGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,
      async preparingTemplateTask() {},
    });
  }

  get [AngularGenerator.CONFIGURING_EACH_ENTITY]() {
    return this.asConfiguringEachEntityTaskGroup({
      ...super.configuringEachEntity,
      async configuringEachEntityTemplateTask() {},
    });
  }

  get [AngularGenerator.LOADING_ENTITIES]() {
    return this.asLoadingEntitiesTaskGroup({
      ...super.loadingEntities,
      async loadingEntitiesTemplateTask() {},
    });
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY]() {
    return this.asPreparingEachEntityTaskGroup({
      ...super.preparingEachEntity,
      async preparingEachEntityTemplateTask() {},
    });
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return this.asPreparingEachEntityFieldTaskGroup({
      ...super.preparingEachEntityField,
      async preparingEachEntityFieldTemplateTask() {},
    });
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return this.asPreparingEachEntityRelationshipTaskGroup({
      ...super.preparingEachEntityRelationship,
      async preparingEachEntityRelationshipTemplateTask() {},
    });
  }

  get [AngularGenerator.POST_PREPARING_EACH_ENTITY]() {
    return this.asPostPreparingEachEntityTaskGroup({
      ...super.postPreparingEachEntity,
      async postPreparingEachEntityTemplateTask() {},
    });
  }

  get [AngularGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      ...super.default,
      async defaultTemplateTask() {},
    });
  }

  get [AngularGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...super.writing,
      async writingTemplateTask({ application }) {
        await this.writeFiles({
          sections: {
            files: [{ templates: ['template-file-angular'] }],
          },
          context: application,
        });
      },
    });
  }

  get [AngularGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      ...super.writingEntities,
      async writingEntitiesTemplateTask() {},
    });
  }

  get [AngularGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
      async postWritingTemplateTask() {},
    });
  }

  get [AngularGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      ...super.postWritingEntities,
      async postWritingEntitiesTemplateTask() {},
    });
  }

  get [AngularGenerator.LOADING_TRANSLATIONS]() {
    return this.asLoadingTranslationsTaskGroup({
      ...super.loadingTranslations,
      async loadingTranslationsTemplateTask() {},
    });
  }

  get [AngularGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      ...super.install,
      async installTemplateTask() {},
    });
  }

  get [AngularGenerator.POST_INSTALL]() {
    return this.asPostInstallTaskGroup({
      ...super.postInstall,
      async postInstallTemplateTask() {},
    });
  }

  get [AngularGenerator.END]() {
    return this.asEndTaskGroup({
      ...super.end,
      async endTemplateTask() {},
    });
  }
}
