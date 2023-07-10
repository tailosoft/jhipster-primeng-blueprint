/**
 * Copyright 2013-2023 the original author or authors from the JHipster project.
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
// This file is copied, types are moved and converted is converted to mjs, and `this` param of writeEntitiesFiles is removed
import { clientApplicationBlock } from '../client/utils.mjs';

export const angularFiles = {
  client: [
    {
      ...clientApplicationBlock,
      templates: ['entities/_entityFolder/_entityFile.model.ts', 'entities/_entityFolder/_entityFile.test-samples.ts'],
    },
    {
      condition: generator => !generator.embedded,
      ...clientApplicationBlock,
      templates: [
        'entities/_entityFolder/_entityFile.routes.ts',
        'entities/_entityFolder/detail/_entityFile-detail.component.html',
        'entities/_entityFolder/detail/_entityFile-detail.component.ts',
        'entities/_entityFolder/detail/_entityFile-detail.component.spec.ts',
        'entities/_entityFolder/list/_entityFile.component.html',
        'entities/_entityFolder/list/_entityFile.component.ts',
        'entities/_entityFolder/list/_entityFile.component.spec.ts',
        'entities/_entityFolder/route/_entityFile-routing-resolve.service.ts',
        'entities/_entityFolder/route/_entityFile-routing-resolve.service.spec.ts',
        'entities/_entityFolder/service/_entityFile.service.ts',
        'entities/_entityFolder/service/_entityFile.service.spec.ts',
      ],
    },
    {
      condition: generator => !generator.readOnly && !generator.embedded,
      ...clientApplicationBlock,
      templates: [
        'entities/_entityFolder/update/_entityFile-form.service.ts',
        'entities/_entityFolder/update/_entityFile-form.service.spec.ts',
        'entities/_entityFolder/update/_entityFile-update.component.html',
        'entities/_entityFolder/update/_entityFile-update.component.ts',
        'entities/_entityFolder/update/_entityFile-update.component.spec.ts',
      ],
    },
  ],
};

export async function writeEntitiesFiles({ application, entities, control }) {
  await control.loadClientTranslations?.();

  for (const entity of entities.filter(entity => !entity.skipClient && !entity.builtIn)) {
    await this.writeFiles({
      sections: angularFiles,
      context: { ...application, ...entity, entity, getWebappTranslation: control.getWebappTranslation },
    });
  }
}
