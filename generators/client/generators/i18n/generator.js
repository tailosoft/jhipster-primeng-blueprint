import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,

      sbsBlueprint: true,
    });
  }

  get [BaseApplicationGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      async updateTranslations({ application, entities }) {
        const entitiesToWriteTranslationFor = entities.filter(entity => !entity.skipClient && !entity.builtInUser);
        if (!application.userManagement?.skipClient) {
          entitiesToWriteTranslationFor.push(application.userManagement);
        }

        const { enableTranslation, languages, frontendAppName } = application;
        if (!enableTranslation) return;

        this.queueTask({
          method: async () => {
            for (const entity of entitiesToWriteTranslationFor) {
              const { entityTranslationKey, readOnly } = entity;
              if (!readOnly) {
                for (const lang of languages) {
                  this.editEntityTranslation( application.translations, frontendAppName, entityTranslationKey, lang);
                }
              }
            }
          },
          taskName: 'updateTranslations',
          queueName: 'jhipster:loadingTranslations',
          once: true,
        });
      },
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async updateTranslations({ application, entities }) {
        const entitiesToWriteTranslationFor = entities.filter(entity => !entity.skipClient && !entity.builtInUser);
        if (!application.userManagement?.skipClient) {
          entitiesToWriteTranslationFor.push(application.userManagement);
        }

        const { clientI18nDir, enableTranslation, languages, frontendAppName } = application;
        if (!enableTranslation) return;
        for (const entity of entitiesToWriteTranslationFor) {
          const { entityTranslationKey, readOnly } = entity;
          if (!readOnly) {
            for (const lang of languages) {
              const translationFile = `${clientI18nDir}${lang}/${entityTranslationKey}.json`;
              this.editFile(translationFile, { assertModified: true }, content => {
                const json = JSON.parse(content);
                this.editEntityTranslation(json, frontendAppName, entityTranslationKey, lang);
                return JSON.stringify(json, null, 2);
              });
            }
          }
        }
      }
    });
  }


  editEntityTranslation(json, frontendAppName, entityTranslationKey, lang) {
    const home = json[frontendAppName][entityTranslationKey].home;
    if (home.createOrEditLabel) {
      if (lang === 'en') {
        home.editLabel = home.createOrEditLabel.replace(/Create or edit/, 'Edit');
        delete home.createOrEditLabel;
      } else if (lang === 'fr') {
        home.editLabel = home.createOrEditLabel.replace(/Créer ou éditer/, 'Editer');
        delete home.createOrEditLabel;
      }
    }
  }
}
