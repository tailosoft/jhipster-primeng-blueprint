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
const _ = require('lodash');
const utils = require('generator-jhipster/generators/utils');
const constants = require('generator-jhipster/generators/generator-constants');
const ClientAngular = require('../client/needle-api/needle-client-angular');

/* Constants use throughout */
const { CLIENT_TEST_SRC_DIR, ANGULAR_DIR } = constants;
const { ANGULAR } = constants.SUPPORTED_CLIENT_FRAMEWORKS;

const CLIENT_COMMON_TEMPLATES_DIR = 'common';
const CLIENT_NG2_TEMPLATES_DIR = 'angular';

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */

const angularFiles = {
    client: [
        {
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'entities/entity.model.ts',
                    // using entityModelFileName so that there is no conflict when generating microservice entities
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}.model.ts`
                }
            ]
        },
        {
            condition: generator => !generator.embedded,
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'entities/list/entity-management.component.html',
                    method: 'processHtml',
                    template: true,
                    renameTo: generator => `entities/${generator.entityFolderName}/list/${generator.entityFileName}.component.html`
                },
                {
                    file: 'entities/detail/entity-management-detail.component.html',
                    method: 'processHtml',
                    template: true,
                    renameTo: generator => `entities/${generator.entityFolderName}/detail/${generator.entityFileName}-detail.component.html`
                },
                {
                    file: 'entities/entity-management.module.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}.module.ts`
                },
                {
                    file: 'entities/route/entity-management-routing.module.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/route/${generator.entityFileName}-routing.module.ts`
                },
                {
                    file: 'entities/route/entity-management-routing-resolve.service.ts',
                    renameTo: generator =>
                        `entities/${generator.entityFolderName}/route/${generator.entityFileName}-routing-resolve.service.ts`
                },
                {
                    file: 'entities/list/entity-management.component.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/list/${generator.entityFileName}.component.ts`
                },
                {
                    file: 'entities/detail/entity-management-detail.component.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/detail/${generator.entityFileName}-detail.component.ts`
                },
                {
                    file: 'entities/service/entity.service.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/service/${generator.entityFileName}.service.ts`
                }
            ]
        },
        {
            condition: generator => !generator.readOnly && !generator.embedded,
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'entities/update/entity-management-update.component.html',
                    method: 'processHtml',
                    template: true,
                    renameTo: generator => `entities/${generator.entityFolderName}/update/${generator.entityFileName}-update.component.html`
                },
                {
                    file: 'entities/update/entity-management-update.component.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/update/${generator.entityFileName}-update.component.ts`
                }
            ]
        }
    ],
    test: [
        {
            condition: generator => !generator.embedded,
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'entities/detail/entity-management-detail.component.spec.ts',
                    renameTo: generator =>
                        `entities/${generator.entityFolderName}/detail/${generator.entityFileName}-detail.component.spec.ts`
                },
                {
                    file: 'entities/list/entity-management.component.spec.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/list/${generator.entityFileName}.component.spec.ts`
                },
                {
                    file: 'entities/service/entity.service.spec.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/service/${generator.entityFileName}.service.spec.ts`
                },
                {
                    file: 'entities/route/entity-management-routing-resolve.service.spec.ts',
                    renameTo: generator =>
                        `entities/${generator.entityFolderName}/route/${generator.entityFileName}-routing-resolve.service.spec.ts`
                }
            ]
        },
        {
            condition: generator => !generator.readOnly && !generator.embedded,
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'entities/update/entity-management-update.component.spec.ts',
                    renameTo: generator =>
                        `entities/${generator.entityFolderName}/update/${generator.entityFileName}-update.component.spec.ts`
                }
            ]
        },
        {
            condition: generator => generator.protractorTests && !generator.embedded,
            path: CLIENT_TEST_SRC_DIR,
            templates: [
                {
                    file: 'e2e/entities/entity-page-object.ts',
                    renameTo: generator => `e2e/entities/${generator.entityFolderName}/${generator.entityFileName}.page-object.ts`
                },
                {
                    file: 'e2e/entities/entity.spec.ts',
                    renameTo: generator => `e2e/entities/${generator.entityFolderName}/${generator.entityFileName}.spec.ts`
                }
            ]
        }
    ]
};

const commonFiles = {
    testsCypress: [
        {
            condition: generator => generator.cypressTests && !generator.embedded,
            path: `${CLIENT_TEST_SRC_DIR}cypress/`,
            templates: [
                {
                    file: 'integration/entity/entity.spec.ts',
                    renameTo: generator => `integration/entity/${generator.entityFileName}.spec.ts`
                }
            ]
        }
    ]
};

module.exports = {
    writeFiles,
    customizeFiles,
    angularFiles,
    commonFiles
};

function addEnumerationFiles(generator, clientFolder) {
    generator.fields.forEach(field => {
        if (field.fieldIsEnum === true) {
            const enumFileName = _.kebabCase(field.fieldType);
            const enumInfo = {
                ...utils.getEnumInfo(field, generator.clientRootFolder),
                frontendAppName: generator.frontendAppName,
                packageName: generator.packageName,
            };
            if (!generator.skipClient) {
                const modelPath = generator.clientFramework === ANGULAR ? 'entities' : 'shared/model';
                const destinationFile = generator.destinationPath(`${clientFolder}${modelPath}/enumerations/${enumFileName}.model.ts`);
                generator.template(
                    `./${CLIENT_COMMON_TEMPLATES_DIR}/${clientFolder}entities/enumerations/enum.model.ts.ejs`,
                    destinationFile,
                    generator,
                    {},
                    // export _ to be used in template for _ARRAY..
                    { ...enumInfo, _ }
                );
            }
        }
    });
}

function addSampleRegexTestingStrings(generator) {
    generator.fields.forEach(field => {
        if (field.fieldValidateRulesPattern !== undefined) {
            const randExp =  field.createRandexp();
            field.fieldValidateSampleString = randExp.gen();
            field.fieldValidateModifiedString = randExp.gen();
        }
    });
}

function writeFiles() {
    return {
        writeClientFiles() {
            this.needleApi.clientAngular = new ClientAngular(this);
            if (this.skipClient) return undefined;
            if (this.protractorTests) {
                addSampleRegexTestingStrings(this);
            }

            let files;
            let clientMainSrcDir;
            let templatesDir;

            if (this.clientFramework === ANGULAR) {
                files = angularFiles;
                clientMainSrcDir = ANGULAR_DIR;
                templatesDir = CLIENT_NG2_TEMPLATES_DIR;
            }

            addEnumerationFiles(this, clientMainSrcDir);
            if (!files) return undefined;

            return Promise.all([this.writeFilesToDisk(files, templatesDir), this.writeFilesToDisk(commonFiles, 'common')]);
        }
    };
}

function customizeFiles() {
    if (this.skipClient) return;

    if (!this.embedded) {
        this.addEntityToModule();
        this.addEntityToMenu(
            this.entityStateName,
            this.enableTranslation,
            this.clientFramework,
            this.entityTranslationKeyMenu,
            this.entityClassHumanized
        );
    }
}
