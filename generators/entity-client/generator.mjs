import chalk from 'chalk';
import EntityClientGenerator from 'generator-jhipster/generators/entity-client/index.js';
import { writeAngularFiles } from './files-angular.js';
import { writeCypressEntityFiles } from './files-cypress.cjs';
import pluralize from 'pluralize';

export default class extends EntityClientGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints test-blueprint')}`);
    }
  }

  get [EntityClientGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [EntityClientGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      async promptingTemplateTask() {},
    };
  }

  get [EntityClientGenerator.COMPOSING]() {
    return {
      ...super.composing,
      async composingTemplateTask() {},
    };
  }

  get [EntityClientGenerator.LOADING]() {
    return {
      ...super.loading,
      async loadingTemplateTask() {},
    };
  }

  get [EntityClientGenerator.PREPARING]() {
    return {
      ...super.preparing,
      async preparingTemplateTask() {},
    };
  }

  get [EntityClientGenerator.PREPARING_FIELDS]() {
    return {
      ...super.preparingFields,
      async preparingFieldsTemplateTask() {},
    };
  }

  get [EntityClientGenerator.PREPARING_RELATIONSHIPS]() {
    return {
      ...super.preparingRelationships,
      async preparingRelationshipsTemplateTask() {},
    };
  }

  get [EntityClientGenerator.DEFAULT]() {
    return {
      ...super.default,
      fixDates() {
        this.entity.fields.filter(f => f.tsType === 'dayjs.Dayjs').forEach(f => f.tsType = 'Date');
      },
      prepareRelationshipClientFields() {
        this.entity.relationships.filter(r => r.ownerSide).forEach(rel => {
          // reverse to keep the idField at the end (map is to avoid destructive reverse, reverse is in Place Oo)
          rel.clientFields = rel.otherEntity.primaryKey.fields.map(field => field).reverse().map(field => {
            const name = rel.relationshipName + field.path.slice(0, -1).map(this._.upperFirst).join('');
            const lastRelationship = field.relationshipsPath[field.relationshipsPath.length - 1] || rel;
            let relatedFieldMatchMode = 'equals';
            if (['String', 'UUID'].includes(lastRelationship.relatedField && lastRelationship.relatedField.fieldType)) {
              relatedFieldMatchMode = 'contains';
            }
            const fullPath = [rel.relationshipType === 'many-to-many' ? rel.relationshipNamePlural : rel.relationshipName, ...(field.path)];
            let parentFormName;
            if (field.relationshipsPath.length === 0) {
              parentFormName = '';
            } else if (field.relationshipsPath.length === 1 && rel === lastRelationship) {
              parentFormName = 'editForm';
            } else {
              parentFormName = `${(field.relationshipsPath[field.relationshipsPath.length - 2] || rel).relationshipName}Form`;
            }
            const needsFieldName = lastRelationship.otherEntity.primaryKey.composite;
            return {
              name,
              nameCapitalized: this._.upperFirst(name),
              nameCapitalizedPlural: pluralize(this._.upperFirst(name)),
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
              translationKey: `${this.entity.frontendAppName}.${lastRelationship.reference.entity.entityTranslationKey}.${lastRelationship.relationshipName}`,
              //routerLinkValues: this.entity.primaryKey.fields.filter(pk => [rel, ...pk.relationshipsPath].includes(lastRelationship)).map(pk => ({fieldName: pk.fieldName, nameDottedAsserted: [/* ...field.path.slice(0, -1) */ this.entity.entityInstance, rel.relationshipName, ...field.path].join('.') + '!'})),
              // ${primaryKey.fields.filter(pk => pk.relationshipsPath.includes(cf.lastRelationship)).map(pk => `${field.path.slice(-1)[0]} : ${entityInstance}.${relationship.relationshipName}.${pk.fieldNameDottedAsserted}`).join(',')}
              routerLinkValues: field.entity.primaryKey.fields.map(f => ({fieldName: f.fieldName, nameDotted: [...(field.relationshipsPath.slice(0 ,field.relationshipsPath.indexOf(lastRelationship) + 1).map(r => r.relationshipName)), ...f.path].join('.')})),
              needsFieldName
            }
          })
        })
      }
    };
  }

  get [EntityClientGenerator.WRITING]() {
    return {
      ...super.writing,
      writeAngularFiles,
      writeCypressEntityFiles
    };
  }

  get [EntityClientGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [EntityClientGenerator.INSTALL]() {
    return {
      ...super.install,
      async installTemplateTask() {},
    };
  }

  get [EntityClientGenerator.POST_INSTALL]() {
    return {
      ...super.postInstall,
      async postInstallTemplateTask() {},
    };
  }

  get [EntityClientGenerator.END]() {
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
