import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { createFaker } from 'generator-jhipster/generators/base-application/support';
import { generateTestEntity } from 'generator-jhipster/generators/client/support';
import { mutateData, stringHashCode } from 'generator-jhipster/utils';

import { patchFakeDataForPrimeng } from '../e2e-utils.mjs';

import { playwrightEntityFiles, playwrightFiles } from './files.js';

const WAIT_TIMEOUT = 3 * 60000;

const DEFAULT_BROWSERS = ['chromium'];

/**
 * Pinned here rather than read from `application.nodeDependencies`: JHipster does not ship
 * playwright in its client `resources/package.json`, so there is nothing to look up.
 */
const PLAYWRIGHT_DEPENDENCIES = {
  '@playwright/test': '1.62.1',
  'eslint-plugin-playwright': '2.11.0',
};

export default class extends BaseApplicationGenerator {
  async beforeQueue() {
    await this.dependsOnBootstrap('client');
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      loadPlaywrightConfig({ application }) {
        const { playwrightBrowsers = DEFAULT_BROWSERS } = this.jhipsterConfig;
        application.playwrightBrowsers = playwrightBrowsers;
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      prepareForTemplates({ applicationDefaults }) {
        applicationDefaults({
          playwrightDir: ({ clientTestDir }) => (clientTestDir ? `${clientTestDir}playwright/` : 'playwright/'),
          playwrightTemporaryDir: ({ temporaryDir }) => (temporaryDir ? `${temporaryDir}playwright/` : '.playwright/'),
          // Cypress owns the generic `e2e` / `e2e:headless` scripts when both are enabled.
          playwrightOwnsE2eScripts: ({ testFrameworks }) => !testFrameworks?.includes('cypress'),
          // Normally set by the angular sub-generator; defaulted here so that playwright can
          // also be generated on its own.
          fineGrainedPermissions: () => this.options.blueprints?.includes('generator-jhipster-preauthorize') ?? false,
        });
      },
      npmScripts({ application }) {
        const { devServerPort, devServerPortProxy: devServerPortE2e = devServerPort, playwrightOwnsE2eScripts } = application;

        Object.assign(application.clientPackageJsonScripts, {
          playwright: 'playwright test --ui',
          'e2e:playwright': 'playwright test',
          'e2e:playwright:headed': 'playwright test --headed',
          'e2e:playwright:debug': 'playwright test --debug',
          'e2e:playwright:report': 'playwright show-report',
        });

        if (!playwrightOwnsE2eScripts) return;

        Object.assign(application.clientPackageJsonScripts, {
          e2e: 'npm run e2e:playwright:headed --',
          'e2e:headless': 'npm run e2e:playwright --',
        });

        // Scripts that handle server and client concurrently belong to the root package.json
        Object.assign(application.packageJsonScripts, {
          'ci:e2e:run': 'concurrently -k -s first -n application,e2e -c red,blue npm:ci:e2e:server:start npm:e2e:headless',
          'ci:e2e:dev': 'concurrently -k -s first -n application,e2e -c red,blue npm:app:start npm:e2e:headless',
          'e2e:dev': 'concurrently -k -s first -n application,e2e -c red,blue npm:app:start npm:e2e',
          'e2e:devserver': `concurrently -k -s first -n backend,frontend,e2e -c red,yellow,blue npm:backend:start npm:start "wait-on -t ${WAIT_TIMEOUT} http-get://127.0.0.1:${devServerPortE2e} && npm run e2e:headless -- --config playwright.config.ts"`,
        });

        if (application.clientRootDir) {
          // Map the workspace script to the client package.json
          Object.assign(application.packageJsonScripts, {
            'e2e:headless': `npm run -w ${application.clientRootDir} e2e:headless`,
          });
        } else if (application.backendTypeJavaAny) {
          Object.assign(application.clientPackageJsonScripts, {
            'pree2e:headless': 'npm run ci:server:await',
          });
        }
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return this.asPreparingEachEntityFieldTaskGroup({
      customizeFakeData({ field }) {
        patchFakeDataForPrimeng(field);
      },
    });
  }

  get [BaseApplicationGenerator.POST_PREPARING_EACH_ENTITY]() {
    return this.asPostPreparingEachEntityTaskGroup({
      prepareForTemplates({ entity }) {
        mutateData(entity, {
          workaroundEntityCannotBeEmpty: false,
          workaroundInstantReactiveMariaDB: false,
        });
      },
    });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writeFiles({ application }) {
        const faker = await createFaker();
        faker.seed(stringHashCode(application.baseName));
        return this.writeFiles({
          sections: playwrightFiles,
          context: { ...application, faker },
        });
      },
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async writePlaywrightEntityFiles({ application, entities }) {
        for (const entity of entities.filter(
          entity => !entity.skipClient && !entity.embedded && !entity.builtInUser && !entity.entityClientModelOnly,
        )) {
          await this.writeFiles({
            sections: playwrightEntityFiles,
            context: { ...application, ...entity },
          });
        }
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      packageJson({ application }) {
        this.createStorage(this.destinationPath(application.clientRootDir, 'package.json')).merge({
          devDependencies: PLAYWRIGHT_DEPENDENCIES,
        });
      },
      mavenProfile({ application, source }) {
        // Cypress registers the very same profile; adding it twice would duplicate it in the pom.
        if (!application.playwrightOwnsE2eScripts) return;
        source.addMavenProfile?.({
          id: 'e2e',
          content: `
            <properties>
                <profile.e2e>,e2e</profile.e2e>
            </properties>
            <build>
                <finalName>e2e</finalName>
            </build>
          `,
        });
      },
    });
  }

  generateTestEntity(fields) {
    return generateTestEntity(fields);
  }
}
