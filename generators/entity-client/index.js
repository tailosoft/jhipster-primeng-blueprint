/* eslint-disable consistent-return */
const EntityClientGenerator = require('generator-jhipster/generators/entity-client');
const chalk = require('chalk');
const _ = require('lodash');
const pluralize = require('pluralize');
const path = require('path');
const writeFiles = require('./files').writeFiles;

const JHIPSTER_CONFIG_DIR = '.jhipster';

const defaultIdField = {
    name: 'id',
    fieldName: 'id',
    fieldType: 'Long',
    fieldNameAsDatabaseColumn: 'id',
    fieldNameUnderscored: 'id',
    fieldInJavaBeanMethod: 'Id',
    fieldNameHumanized: 'ID',
    fieldValidate: false,
    fieldValidateRules: [],
    options: { id: true }
};

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        //TODO issue to report to jhipster
        // super overrides this this.options with this.options.context.options losing the refernce of options
        // thankfully we can retreive it from the opts param
        // MAYBE we should do another check for blueprint in the if below
        const jhContext = (this.jhipsterContext = opts.jhipsterContext);

        // TODO check with jhispter team what this is supposed to do:
        //- in case of EntityClientGenerator options doesn't contain jhipsterContext

        if (!jhContext) {
            this.error(
                `This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint primeng-blueprint')}`
            );
        }

        this.configOptions = jhContext.configOptions || {};
        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupEntityOptions(this, jhContext);
    }

    get writing() {
        /**
         * Any method beginning with _ can be reused from the superclass `EntityClientGenerator`
         *
         * There are multiple ways to customize a phase from JHipster.
         *
         * 1. Let JHipster handle a phase, blueprint doesnt override anything.
         * ```
         *      return super._writing();
         * ```
         *
         * 2. Override the entire phase, this is when the blueprint takes control of a phase
         * ```
         *      return {
         *          myCustomWritePhaseStep() {
         *              // Do all your stuff here
         *          },
         *          myAnotherCustomWritePhaseStep(){
         *              // Do all your stuff here
         *          }
         *      };
         * ```
         *
         * 3. Partially override a phase, this is when the blueprint gets the phase from JHipster and customizes it.
         * ```
         *      const phaseFromJHipster = super._writing();
         *      const myCustomPhaseSteps = {
         *          writeClientFiles() {
         *              // override the writeClientFiles method from the _writing phase of JHipster
         *          },
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *      }
         *      return Object.assign(phaseFromJHipster, myCustomPhaseSteps);
         * ```
         */
        const prePhaseSteps = {
            // making sure name is unique to not override any step
            primengBlueprintPopulatingRelationshipPagination() {
                this.relationships.forEach(relationship => {
                    const otherEntityData = this._getEntityJson(relationship.otherEntityName);
                    relationship.pagination = otherEntityData.pagination;
                    relationship.jpaMetamodelFiltering = otherEntityData.jpaMetamodelFiltering;
                    if (relationship.relationshipType === 'many-to-one'
                        || (relationship.relationshipType === 'one-to-one' && relationship.ownerSide === true)
                        || (relationship.relationshipType === 'many-to-many' && relationship.ownerSide === true)) {
                        relationship.inList = true;
                        relationship.inForm = true;
                    }
                });
            },

            primengBlueprintConfiguration() {
                const context = this;
                context.pluralize = pluralize;
                this._computePkData(context);
                this._populateTsVaribales(context);
                if (context.pkData.length === 1) {
                    context.pkType = context.pkData[0].type;
                    context.pkName = context.pkData[0].name;
                } else {
                    context.pkType = `${context.entityClass}Id`;
                    context.pkName = 'id';
                }
                context.pkData.forEach(pk => {
                    pk.nameCapitalized = _.upperFirst(pk.name);
                    pk.columnName = _.snakeCase(pk.name);
                    pk.getter = (pk.type === 'Boolean' ? 'is' : 'get') + pk.nameCapitalized;
                    pk.setter = `set${pk.nameCapitalized}`;
                });
            },

            primengBlueprintLoadFieldsInRelationship() {
                this.relationships.forEach(r => {
                    const otherContext = this._getEntityJson(r.otherEntityNameCapitalized);
                    r.fields = otherContext.fields;
                    if (r.pkData.length === 1 && r.pkData[0].name === 'id' && r.pkData[0].type === 'Long') {
                        r.fields.unshift(defaultIdField);
                    }
                    r.relationships = otherContext.relationships;
                });
            }
        };
        const phaseFromJHipster = super._writing();
        const customPhaseSteps = {
            writeClientFiles() {
                //override the writeClientFiles method from the _writing phase of JHipster
                writeFiles().writeClientFiles.call(this);
            }
        };
        return Object.assign(prePhaseSteps, phaseFromJHipster, customPhaseSteps);
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }

    _loadRelationshipPkData(entityName, currentContext) {
        const context = this._getEntityJson(entityName);
        context.angularName = _.upperFirst(entityName) + _.upperFirst(context.angularJSSuffix || '');
        context.angularXAppName = this.getAngularXAppName(currentContext.baseName);
        context.fileName = _.kebabCase(context.angularName);
        context.folderName = this.getEntityFolderName(context.clientRootFolder, context.fileName);
        context.modelFileName = context.folderName;
        context.parentPathAddition = this.getEntityParentPathAddition(context.clientRootFolder);
        if (context.applicationType === 'microservice') {
            context.microserviceName = currentContext.baseName;
            if (!context.clientRootFolder) {
                context.clientRootFolder = context.microserviceName;
            }
        }
        if(context.microserviceName && !context.clientRootFolder) {
            context.clientRootFolder = context.microserviceName;
        }
        if (_.upperFirst(context.name) !== 'User') {
            context.moduleName = `${context.angularXAppName + _.upperFirst(context.name)}Module`;
            context.fileName = _.kebabCase(context.angularName);
            if (
                context.skipUiGrouping ||
                context.clientRootFolder === '' ||
                context.clientRootFolder === undefined
            ) {
                context.clientRootFolder = '';
            } else {
                context.clientRootFolder = `${context.clientRootFolder}/`;
            }
            if (context !== undefined && context.clientRootFolder) {
                if (context.clientRootFolder === currentContext.clientRootFolder) {
                    context.modulePath = context.fileName;
                } else {
                    context.modulePath = `${
                        context.parentPathAddition ? `${context.parentPathAddition}/` : ''
                        }${context.clientRootFolder}/${context.fileName}`;
                }
                context.modelName = `${context.clientRootFolder}/${context.filename}`;
                context.path = `${context.clientRootFolder}/${context.filename}`;
            } else {
                context.modulePath = `${
                    context.parentPathAddition ? `${context.parentPathAddition}/` : ''
                    }${context.filename}`;
                context.modelName = context.fileName;
                context.path = context.fileName;
            }
        } else {
            context.moduleName = `${context.angularXAppName}SharedModule`;
            context.modulePath = 'app/core';
        }

        this._computePkData(context, currentContext);
        return context.pkData;
    }

    _computePkData(context, previousContext) {
        if (!context.fields.some(x => x.options && x.options.id) && !context.relationships.some(r => this._checkRelationshipPartOfId(r))) {
            context.fields.unshift(defaultIdField);
            context.isAutoIncrement = true;
        } else {
            context.isAutoIncrement = false;
        }
        context.pkData = [];
        for (let i = 0; i < context.fields.length; i++) {
            const field = context.fields[i];
            this._populateFieldTsValues(field);
            if (field.options && field.options.id) {
                field.partOfId = true;
                context.pkData.push({
                    // To load field like javadoc, validation... for DTO
                    ...field,
                    name: field.fieldName,
                    type: field.fieldType,
                    entityName: context.name,
                    nameHumanized: field.fieldNameHumanized,
                    field,
                    entity: context,
                    tsType: field.tsType
                });
            }
        }
        // TODO handle cyclic references specially in criteria
        for (let i = 0; i < context.relationships.length; i++) {
            const relationship = context.relationships[i];
            if (previousContext && previousContext.name === _.upperFirst(relationship.otherEntityName)) {
                relationship.pkData = previousContext.pkData;
            } else {
                relationship.pkData = this._loadRelationshipPkData(relationship.otherEntityName, context);
                if(!relationship.otherEntityField || relationship.otherEntityField === 'id') {
                    relationship.otherEntityField = relationship.pkData[0].name;
                }
                relationship.pkData.forEach(pk => {
                    pk.nameCapitalized = _.upperFirst(pk.name);
                    pk.fieldValidate = relationship.relationshipValidateRules === 'required';
                    pk.fieldValidateRules = pk.fieldValidate ? ['required'] : [];
                    pk.otherEntityNameCapitalized = relationship.otherEntityNameCapitalized;
                    pk.nameHumanized = _.startCase(context.relationshipNameHumanized);
                    pk.formName = relationship.relationshipName + (pk.formName ? _.upperFirst(pk.formName) : '');
                    // if two ids are created using fields we might need to check here if so this is done only once, I personally don't see any real use case for this
                    if (!pk.otherEntityField) {
                        pk.otherEntityField = relationship.otherEntityField;
                    }
                });
            }
            if (relationship.options && relationship.options.id && relationship.relationshipType === 'many-to-one') {
                relationship.partOfId = true;
                context.pkData.push(
                    ...relationship.pkData.map(pk => {
                        // there might be a more complicate logic required here, that takes into account, both if the relationship is required, and if the fields of the if of the relationship are
                        // but for now we just set it to required if the relationship is required
                        // set as an array and use fieldValidateRules to have the same code in DTO both if pk is a field in the current entity or comes from a relationship
                        const name = relationship.relationshipName + _.upperFirst(pk.name);
                        return {
                            ...pk,
                            name,
                            nameCapitalized: _.upperFirst(name),
                            nameHumanized: `${relationship.relationshipNameHumanized} ${pk.nameHumanized}`,
                            relationship
                        };
                    })
                );
            }
        }
    }

    _checkRelationshipPartOfId(relationship) {
        return relationship.options && relationship.options.id && relationship.relationshipType === 'many-to-one';
    }

    _populateTsVaribales(context) {
        context.tsVariables = [];
        let lastPartOfIdIdx = 0;
        context.fields.forEach(field => {
            const fieldName = field.fieldName;
            if (['byte[]', 'ByteBuffer'].includes(field.fieldType) && field.fieldTypeBlobContent !== 'text') {
                context.tsVariables.push({name: `${fieldName}ContentType`, type: string, tsTestValue: 'image/png'});
            }
            const res = {name: fieldName, type: field.tsType, tsTestValue: field.tsTestValue};
            if(field.partOfId) {
                context.tsVariables.splice(lastPartOfIdIdx, 0, res);
                lastPartOfIdIdx++;
            } else {
                context.tsVariables.push(res);
            }
        });

        context.relationships.forEach(relationship => {
            let fieldType;
            let fieldName;
            const relationshipType = relationship.relationshipType;
            if (relationshipType === 'one-to-many' || relationshipType === 'many-to-many') {
                fieldType = `I${relationship.otherEntityAngularName}[]`;
                fieldName = relationship.relationshipFieldNamePlural;
                context.tsVariables.push({name: fieldName, type: fieldType, tsTestValue: 'undefined'});
            } else if (context.dto === 'no') {
                fieldType = `I${relationship.otherEntityAngularName}`;
                fieldName = relationship.relationshipFieldName;
                context.tsVariables.push({name: fieldName, type: fieldType, tsTestValue: 'undefined'});
            } else {
                const relationshipFieldName = relationship.relationshipFieldName;
                const relationshipFieldNamePlural = relationship.relationshipFieldNamePlural;
                const relationshipType = relationship.relationshipType;
                const otherEntityFieldCapitalized = relationship.otherEntityFieldCapitalized;
                const ownerSide = relationship.ownerSide;

                if (relationshipType === 'many-to-many' && ownerSide === true) {
                    fieldType = `I${otherEntityFieldCapitalized}[]`;
                    fieldName = relationshipFieldNamePlural;
                    context.tsVariables.push({name: fieldName, type: fieldType, tsTestValue: 'undefined'});
                } else {
                    if (relationshipType === 'many-to-one' || (relationshipType === 'one-to-one' && ownerSide === true)) {
                        if (otherEntityFieldCapitalized !== 'Id' && otherEntityFieldCapitalized !== ''  && !relationship.pkData.some(pk => relationship.otherEntityField === pk.name)) {
                            //otherEntityField used for display most probably string
                            fieldType = 'string';
                            fieldName = `${relationshipFieldName}${otherEntityFieldCapitalized}`;
                            context.tsVariables.push({name: fieldName, type: fieldType, tsTestValue: "'AAAAAAA'"});
                        }
                    }
                    relationship.pkData.forEach(pk => {
                        fieldName = `${relationship.relationshipFieldName}${pk.nameCapitalized}`;
                        const res = {name: fieldName, type: pk.field.tsType, tsTestValue: pk.field.tsTestValue};
                        if(relationship.partOfId) {
                            context.tsVariables.splice(lastPartOfIdIdx, 0, res);
                            lastPartOfIdIdx++;
                        } else {
                            context.tsVariables.push(res);
                        }
                        fieldName = `${pk.formName}${_.upperFirst(pk.otherEntityField)}`;
                        if(!context.tsVariables.some(x => x.name === fieldName)) {
                            context.tsVariables.push({name: fieldName, type: 'string', tsTestValue: "'AAAAAAA'"});
                        }
                    });
                }
            }
        });
    }

    _populateFieldTsValues(field) {
        const fieldType = field.fieldType;
        if (field.fieldIsEnum) {
            field.tsType = fieldType;
            field.tsTestValue = `${fieldType}.${field.fieldValues.split(',')[0]}`;
        } else if (fieldType === 'Boolean') {
            field.tsType = 'boolean';
            field.tsTestValue = 'false';
        } else if (['Integer', 'Long', 'Float', 'Double', 'BigDecimal', 'Duration'].includes(fieldType)) {
            field.tsType = 'number';
            field.tsTestValue = '123';
        } else if (fieldType === 'String' || fieldType === 'UUID') {
            field.tsType = 'string';
            field.tsTestValue = "'AAAAAAA'";
        } else if (['LocalDate', 'Instant', 'ZonedDateTime'].includes(fieldType)) {
            field.tsType = 'Date';
            field.tsTestValue = 'currentDate';
        } else {
            field.tsType = 'any';
            field.tsTestValue = 'undefined';
        }
    }

    _getEntityJson(file) {
        let entityJson = null;

        try {
            if (this.microservicePath) {
                entityJson = this.fs.readJSON(path.join(this.microservicePath, JHIPSTER_CONFIG_DIR, `${_.upperFirst(file)}.json`));
            } else {
                entityJson = this.fs.readJSON(path.join(JHIPSTER_CONFIG_DIR, `${_.upperFirst(file)}.json`));
            }
        } catch (err) {
            this.log(chalk.red(`The JHipster entity configuration file could not be read for file ${file}!`) + err);
            this.debug('Error:', err);
        }

        return entityJson;
    }
};
