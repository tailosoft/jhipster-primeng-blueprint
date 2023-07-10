import chalk from 'chalk';
import _ from 'lodash';
import pluralize from 'pluralize';
import AngularGenerator from 'generator-jhipster/generators/angular';
import { writeFiles } from './files-angular.mjs';
import { writeEntitiesFiles } from './entity-files-angular.mjs';

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
      async changeTsTypeIfDayjs({ field }) {
        if (field.tsType === 'dayjs.Dayjs') {
          field.tsType = 'Date';
        }
      },
    };
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      ...super.preparingEachEntityRelationship,
      async prepareRelationshipClientFields({ relationship, entity }) {
        if(relationship.ownerSide) {
          // reverse to keep the idField at the end (map is to avoid destructive reverse, reverse is in Place Oo)
          relationship.clientFields = relationship.otherEntity.primaryKey.fields.map(field => field).reverse().map(field => {
            const name = relationship.relationshipName + field.path.slice(0, -1).map(this._.upperFirst).join('');
            const lastRelationship = field.relationshipsPath[field.relationshipsPath.length - 1] || relationship;
            let relatedFieldMatchMode = 'equals';
            if (['String', 'UUID'].includes(lastRelationship.relatedField && lastRelationship.relatedField.fieldType)) {
              relatedFieldMatchMode = 'contains';
            }
            const fullPath = [relationship.relationshipType === 'many-to-many' ? relationship.relationshipNamePlural : relationship.relationshipName, ...(field.path)];
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
              translationKey: `${entity.frontendAppName}.${lastRelationship.reference.entity.entityTranslationKey}.${lastRelationship.relationshipName}`,
              //routerLinkValues: this.entity.primaryKey.fields.filter(pk => [rel, ...pk.relationshipsPath].includes(lastRelationship)).map(pk => ({fieldName: pk.fieldName, nameDottedAsserted: [/* ...field.path.slice(0, -1) */ this.entity.entityInstance, rel.relationshipName, ...field.path].join('.') + '!'})),
              // ${primaryKey.fields.filter(pk => pk.relationshipsPath.includes(cf.lastRelationship)).map(pk => `${field.path.slice(-1)[0]} : ${entityInstance}.${relationship.relationshipName}.${pk.fieldNameDottedAsserted}`).join(',')}
              routerLinkValues: field.entity.primaryKey.fields.map(f => ({
                fieldName: f.fieldName,
                nameDotted: [...(field.relationshipsPath.slice(0, field.relationshipsPath.indexOf(lastRelationship) + 1).map(r => r.relationshipName)), ...f.path].join('.')
              })),
              needsFieldName
            }
          })
        }
      },
    };
  }

  get [AngularGenerator.POST_PREPARING_EACH_ENTITY]() {
    return {
      ...super.postPreparingEachEntity
    };
  }

  get [AngularGenerator.DEFAULT]() {
    return {
      ...super.default,
    };
  }

  get [AngularGenerator.WRITING]() {
    // same as generator-jhipster except writeFiles overridden to exclude files and add other ones
    return {
      ...super.writing,
      writeFiles
    };
  }

  get [AngularGenerator.WRITING_ENTITIES]() {
    return {
      ...super.writingEntities,
      writeEntitiesFiles,
      // override writeEntitiesFiles to remove delete files...
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

  _generateTestEntityPrimaryKey(primaryKey, index = 'random') {
    const random = index === 'random';
    let result = {};
    primaryKey.fields.forEach(field => {
      let subResult = random ? field.generateFakeData('raw') : this.generateTestEntityId(field.fieldType, index, false);
      [...field.path].reverse().forEach(p => subResult = {[p]: subResult});
      return result = this._.merge(result, subResult);
    });
    return JSON.stringify(result);
  }
}
