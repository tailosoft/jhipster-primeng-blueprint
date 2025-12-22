import { asCommand } from 'generator-jhipster';
import { command as jhipsterCommand } from 'generator-jhipster/generators/cypress';

export default asCommand({
  configs: {
    ...jhipsterCommand.configs,
  },
  arguments: {
    ...jhipsterCommand.arguments,
  },
});
