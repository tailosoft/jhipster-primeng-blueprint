import AngularGenerator from 'generator-jhipster/generators/angular';
import _ from 'lodash';
import pluralize from 'pluralize';

import { writeEntitiesFiles } from './entity-files-angular.js';
import { writeFiles } from './files-angular.js';
import { prepareFineGrainedPermissions } from '../client/utils.mjs';

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
      prepareFineGrainedPermissions,
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
      async changeTsTypeIfDayjs({ field }) {
        if (field.tsType === 'dayjs.Dayjs') {
          field.tsType = 'Date';
        }
      },
    });
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return this.asPreparingEachEntityRelationshipTaskGroup({
      ...super.preparingEachEntityRelationship,
      async prepareRelationshipClientFields({ relationship, entity }) {
        if (relationship.ownerSide) {
          // reverse to keep the idField at the end (map is to avoid destructive reverse, reverse is in Place Oo)
          relationship.clientFields = relationship.otherEntity.primaryKey.fields
            .map(field => field)
            .reverse()
            .map(field => {
              const name = relationship.relationshipName + field.path.slice(0, -1).map(this._.upperFirst).join('');
              const pathLength = field.relationshipsPath?.length ?? 0;
              const lastRelationship = pathLength > 0 ? field.relationshipsPath[pathLength - 1] : relationship;
              // The entity where lastRelationship is defined is the otherEntity of the previous relationship in the path
              // (or the current entity if we haven't traversed any relationships)
              const prevRelationship = pathLength > 1 ? field.relationshipsPath[pathLength - 2] : relationship;
              const lastRelationshipEntity = pathLength === 0 ? entity : prevRelationship.otherEntity;
              let relatedFieldMatchMode = 'equals';
              if (['String', 'UUID'].includes(lastRelationship.relatedField && lastRelationship.relatedField.fieldType)) {
                relatedFieldMatchMode = 'contains';
              }
              const fullPath = [
                relationship.relationshipType === 'many-to-many' ? relationship.relationshipNamePlural : relationship.relationshipName,
                ...field.path,
              ];
              let parentFormName;
              if (field.relationshipsPath.length === 0) {
                parentFormName = '';
              } else if (field.relationshipsPath.length === 1 && relationship === lastRelationship) {
                parentFormName = 'editForm';
              } else {
                parentFormName = `${(field.relationshipsPath[field.relationshipsPath.length - 2] || relationship).relationshipName}Form`;
              }
              const needsFieldName = lastRelationship.otherEntity.primaryKey.composite;
              return {
                name,
                nameCapitalized: _.upperFirst(name),
                nameCapitalizedPlural: pluralize(_.upperFirst(name)),
                fullPath,
                fullNameDotted: fullPath.join('.'),
                fieldName: field.path[field.path.length - 1],
                id: field,
                formName: `${lastRelationship.relationshipName}Form`,
                parentFormName,
                entity: field.entity,
                relatedFieldPath: [...field.path.slice(0, -1), lastRelationship.otherEntityField],
                lastRelationship,
                relatedFieldMatchMode,
                translationKey: `${lastRelationshipEntity.i18nKeyPrefix}.${lastRelationship.relationshipName}`,
                //routerLinkValues: this.entity.primaryKey.fields.filter(pk => [rel, ...pk.relationshipsPath].includes(lastRelationship)).map(pk => ({fieldName: pk.fieldName, nameDottedAsserted: [/* ...field.path.slice(0, -1) */ this.entity.entityInstance, rel.relationshipName, ...field.path].join('.') + '!'})),
                // ${primaryKey.fields.filter(pk => pk.relationshipsPath.includes(cf.lastRelationship)).map(pk => `${field.path.slice(-1)[0]} : ${entityInstance}.${relationship.relationshipName}.${pk.nameDottedAsserted}`).join(',')}
                routerLinkValues: field.entity.primaryKey.fields.map(f => ({
                  fieldName: f.fieldName,
                  nameDotted: [
                    ...field.relationshipsPath.slice(0, field.relationshipsPath.indexOf(lastRelationship) + 1).map(r => r.relationshipName),
                    ...f.path,
                  ].join('.'),
                })),
                needsFieldName,
              };
            });
        }
      },
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
      async defaultTemplateTask({ application, entities }) {
        application.anyEntityHasCompositePrimaryKey = entities.some(entity => entity.primaryKey?.composite);
      },
    });
  }

  get [AngularGenerator.WRITING]() {
    // same as generator-jhipster except writeFiles overridden to exclude files and add other ones
    return {
      ...super.writing,
      writeFiles,
    };
  }

  get [AngularGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      ...super.writingEntities,
      writeEntitiesFiles,
      // override writeEntitiesFiles to remove delete files...
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

  _generateTestEntityPrimaryKey(primaryKey, index = 'random') {
    const random = index === 'random';
    let result = {};
    primaryKey.fields.forEach(field => {
      let subResult = random ? field.generateFakeData('raw') : this.generateTestEntityId(field.fieldType, index, false);
      [...field.path].reverse().forEach(p => (subResult = { [p]: subResult }));
      return (result = this._.merge(result, subResult));
    });
    return JSON.stringify(result);
  }
}
