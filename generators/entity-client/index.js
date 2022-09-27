/**
 * Copyright 2013-2021 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable consistent-return */
const _ = require('lodash');
const pluralize = require('pluralize');
const chalk = require('chalk');
const EntityClientGenerator = require('generator-jhipster/generators/entity-client');

const { writeFiles } = require('./files');

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        if (!this.jhipsterContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint helloworld')}`);
        }
    }

    get default() {
        return {
          ...super._default(),
          ...{
            prepareRelationshipClientFields() {
              this.entity.relationships.filter(r => r.ownerSide).forEach(rel => {
                // reverse to keep the idField at the end (map is to avoid destructive reverse, reverse is in Place Oo)
                rel.clientFields = rel.otherEntity.primaryKey.ids.map(id => id).reverse().map(id => {
                  const name = rel.relationshipName + id.field.path.slice(0, -1).map(_.upperFirst).join('');
                  const lastRelationship = id.relationshipsPath[id.relationshipsPath.length - 1] || rel;
                  let relatedFieldMatchMode = 'equals';
                  if (['String', 'UUID'].includes(lastRelationship.relatedField && lastRelationship.relatedField.fieldType)) {
                    relatedFieldMatchMode = 'contains';
                  }
                  const fullPath = [rel.relationshipType === 'many-to-many' ? rel.relationshipNamePlural : rel.relationshipName, ...(id.field.path)];
                  let parentFormName;
                  if (id.relationshipsPath.length === 0) {
                    parentFormName = '';
                  } else if (id.relationshipsPath.length === 1 && rel === lastRelationship) {
                    parentFormName = 'editForm';
                  } else {
                    parentFormName = `${(id.relationshipsPath[id.relationshipsPath.length - 2] || rel).relationshipName}Form`;
                  }
                  const needsFieldName = lastRelationship.otherEntity.primaryKey.composite;
                  return {
                    name,
                    nameCapitalized: _.upperFirst(name),
                    nameCapitalizedPlural: pluralize(_.upperFirst(name)),
                    fullPath,
                    fullNameDotted: fullPath.join('.'),
                    fieldName: id.field.path[id.field.path.length - 1],
                    id,
                    formName: `${lastRelationship.relationshipName}Form`,
                    parentFormName,
                    entity: id.field.entity,
                    relatedFieldPath: [...id.field.path.slice(0, -1), lastRelationship.otherEntityField],
                    lastRelationship,
                    relatedFieldMatchMode,
                    translationKey: `${this.entity.frontendAppName}.${lastRelationship.reference.entity.entityTranslationKey}.${lastRelationship.relationshipName}`,
                    //routerLinkValues: this.entity.primaryKey.ids.filter(pk => [rel, ...pk.relationshipsPath].includes(lastRelationship)).map(pk => ({fieldName: pk.name, nameDottedAsserted: [/* ...id.field.path.slice(0, -1) */ this.entity.entityInstance, rel.relationshipName, ...pk.field.path].join('!.') + '!'})),
                    // ${primaryKey.ids.filter(pk => pk.relationshipsPath.includes(cf.lastRelationship)).map(pk => `${pk.field.path.slice(-1)[0]} : ${entityInstance}!.${relationship.relationshipName}!.${pk.nameDottedAsserted}`).join(',')}
                    routerLinkValues: id.field.entity.primaryKey.ids.map(pk => ({fieldName: pk.name, nameDottedAsserted: [...(id.relationshipsPath.slice(0 ,id.relationshipsPath.indexOf(lastRelationship) + 1).map(r => r.relationshipName)), ...pk.field.path].join('!.') + '!'})),
                    needsFieldName
                  }
                })
              })
            },

            temporaryFixDottedAsserted() {
              const ids = this.entity.primaryKey.ids;
              Object.defineProperty(this.entity.primaryKey, "ids", {
                get: function () { return ids }
              });
              this.entity.primaryKey.ids.forEach(id => {
                const nameDottedAsserted = id.nameDottedAsserted;
                if (!nameDottedAsserted.endsWith('!')) {
                  Object.defineProperty(id, "nameDottedAsserted", {
                    get: function () { return `${nameDottedAsserted}!` }
                  });
                }
              });
            }
          }
        };
    }

    get writing() {
        const phaseFromJHipster = super._writing();
        const customPhaseSteps = {
            writeClientFiles() {
                // override the writeClientFiles method from the _writing phase of JHipster
                writeFiles().writeClientFiles.call(this);
            }
            // ...writeFiles()
        };
        return Object.assign(phaseFromJHipster, customPhaseSteps);
    }

    get postWriting() {
        return super._postWriting();
    }

  _generateTestEntityPrimaryKey(primaryKey, index = 'random') {
    const random = index === 'random';
    let result = {};
    primaryKey.fields.forEach(field => {
      let subResult = random ? field.generateFakeData('raw') : this.generateTestEntityId(field.fieldType, index, false);
      [...field.path].reverse().forEach(p => subResult = {[p]: subResult});
      return result = _.merge(result, subResult);
    });
    return JSON.stringify(result);
  }
};
