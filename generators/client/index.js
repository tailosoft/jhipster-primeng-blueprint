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
const chalk = require('chalk');
const ClientGenerator = require('generator-jhipster/generators/client');
const writeAngularFiles = require('./files-angular').writeFiles;

module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint helloworld')}`);
        }
        //
        // this.configOptions = jhContext.configOptions || {};
        //
        // // This sets up options for this sub generator and is being reused from JHipster
        // jhContext.setupClientOptions(this, jhContext);
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `ClientGenerator`
         *
         * There are multiple ways to customize a phase from JHipster.
         *
         * 1. Let JHipster handle a phase, blueprint doesnt override anything.
         * ```
         *      return super._initializing();
         * ```
         *
         * 2. Override the entire phase, this is when the blueprint takes control of a phase
         * ```
         *      return {
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *          myAnotherCustomInitPhaseStep(){
         *              // Do all your stuff here
         *          }
         *      };
         * ```
         *
         * 3. Partially override a phase, this is when the blueprint gets the phase from JHipster and customizes it.
         * ```
         *      const phaseFromJHipster = super._initializing();
         *      const myCustomPhaseSteps = {
         *          displayLogo() {
         *              // override the displayLogo method from the _initializing phase of JHipster
         *          },
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *      }
         *      return Object.assign(phaseFromJHipster, myCustomPhaseSteps);
         * ```
         */
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get prompting() {
        // The prompting phase is being overriden so that we can ask our own questions
        // return {
        //     askForClient: prompts.askForClient,
        //     askForClientSideOpts: prompts.askForClientSideOpts,

        //     setSharedConfigOptions() {
        //         this.configOptions.lastQuestion = this.currentQuestion;
        //         this.configOptions.totalQuestions = this.totalQuestions;
        //         this.configOptions.clientFramework = this.clientFramework;
        //         this.configOptions.useSass = this.useSass;
        //     }
        // };
        // If the prompts need to be overriden then use the code commented out above instead

        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._prompting();
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get composing() {
        return super._composing();
    }

    get loading() {
        return super._loading();
    }

    get preparing() {
        return super._preparing();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        // override the write method from the _writing phase of JHipster
        const phaseFromJHipster = super._writing();
        const customPhaseSteps = {
            write() {
                writeAngularFiles.call(this);
            }
        };
        return Object.assign(phaseFromJHipster, customPhaseSteps);
    }

    get postWriting() {
        return super._postWriting();
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }
};
