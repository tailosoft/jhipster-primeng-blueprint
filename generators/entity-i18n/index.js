/* eslint-disable consistent-return */
const EntityI18nGenerator = require('generator-jhipster/generators/entity-i18n');
const writeFiles = require('./files').writeFiles;

module.exports = class extends EntityI18nGenerator {
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
        const phaseFromJHipster = super._writing();
        const customPhaseSteps = {
            writeClientFiles() {
                //override the writeClientFiles method from the _writing phase of JHipster
                writeFiles().writeClientFiles.call(this);
            }
        };
        return Object.assign(phaseFromJHipster, customPhaseSteps);
    }
};
