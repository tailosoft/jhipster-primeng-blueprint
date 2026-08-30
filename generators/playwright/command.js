import { asCommand } from 'generator-jhipster';

export default asCommand({
  configs: {
    playwrightBrowsers: {
      description: 'Browsers (playwright projects) to generate, comma separated: chromium, firefox, webkit',
      cli: {
        type: Array,
      },
      scope: 'storage',
    },
  },
});
