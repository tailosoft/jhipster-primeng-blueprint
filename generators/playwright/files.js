import { asWriteFilesSection } from 'generator-jhipster/generators/base-application/support';
import { clientRootTemplatesBlock } from 'generator-jhipster/generators/client/support';

import { CLIENT_TEST_SRC_DIR } from '../generator-constants.mjs';

const PLAYWRIGHT_TEMPLATE_SOURCE_DIR = `${CLIENT_TEST_SRC_DIR}playwright/`;

const playwrightBlock = block => ({
  path: PLAYWRIGHT_TEMPLATE_SOURCE_DIR,
  renameTo: (ctx, file) => `${ctx.playwrightDir}${file}`,
  ...block,
});

export const playwrightFiles = asWriteFilesSection({
  common: [
    {
      templates: ['README.md.jhi.playwright'],
    },
    clientRootTemplatesBlock({
      templates: ['playwright.config.ts'],
    }),
    clientRootTemplatesBlock({
      templates: ['eslint.config.ts.jhi.playwright'],
    }),
  ],
  clientTestFw: [
    playwrightBlock({
      templates: [
        'fixtures/integration-test.png',
        'tsconfig.json',
        'support/api.ts',
        'support/auth.ts',
        'support/entity.ts',
        'support/fixtures.ts',
        'support/management.ts',
        'support/navbar.ts',
        'support/network.ts',
        'support/selectors.ts',
        'e2e/administration/administration.spec.ts',
      ],
    }),
    playwrightBlock({
      condition: generator => !generator.applicationTypeMicroservice,
      templates: ['e2e/account/logout.spec.ts'],
    }),
    playwrightBlock({
      condition: generator => !generator.authenticationTypeOauth2,
      templates: ['e2e/account/login-page.spec.ts'],
    }),
    playwrightBlock({
      condition: generator => Boolean(generator.generateUserManagement),
      templates: [
        'support/account.ts',
        'e2e/account/register-page.spec.ts',
        'e2e/account/settings-page.spec.ts',
        'e2e/account/password-page.spec.ts',
        'e2e/account/reset-password-page.spec.ts',
      ],
    }),
    playwrightBlock({
      condition: generator => generator.authenticationTypeOauth2,
      templates: ['support/oauth2.ts'],
    }),
  ],
});

export const playwrightEntityFiles = asWriteFilesSection({
  testsPlaywright: [
    {
      path: PLAYWRIGHT_TEMPLATE_SOURCE_DIR,
      renameTo: ctx => `${ctx.playwrightDir}e2e/entity/${ctx.entityFileName}.spec.ts`,
      templates: ['e2e/entity/_entity_.spec.ts'],
    },
  ],
});
