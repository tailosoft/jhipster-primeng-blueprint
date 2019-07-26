/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityGenerator = require('generator-jhipster/generators/entity');

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(
                `This is a JHipster blueprint and should be used only like ${chalk.yellow(
                    'jhipster --blueprint generator-jhipster-blueprint'
                )}`
            );
        }

        this.configOptions = jhContext.configOptions || {};
        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupEntityOptions(this, jhContext, this);
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `EntityGenerator`
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
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._prompting();
    }

    get configuring() {
        const phaseFromJHipster = super._configuring();
        const myCustomPhaseSteps = {
            // making sure name is unique to not override any step
            primengBlueprintPopulatingRelationshipPagination() {
                this.context.relationships.forEach(relationship => {
                    const otherEntityData = this.getEntityJson(relationship.otherEntityName);
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
        };
        return Object.assign(phaseFromJHipster, myCustomPhaseSteps);
    }

    get writing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._writing();
    }

    get install() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._install();
    }
};
