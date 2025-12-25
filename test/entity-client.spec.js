const path = require('path');

const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('Subgenerator entity-client of primeng-blueprint JHipster blueprint', () => {
  describe('Sample test', () => {
    before(done => {
      helpers
        .run('generator-jhipster/generators/entity')
        .inTmpDir(dir => {
          fse.copySync(path.join(__dirname, '../test/templates/primeng-blueprint-test'), dir);
        })
        .withOptions({
          'from-cli': true,
          skipInstall: true,
          blueprint: 'primeng-blueprint',
          skipChecks: true,
        })
        .withGenerators([
          [require('generator-jhipster/generators/entity'), 'jhipster:entity', require.resolve('generator-jhipster/generators/entity')],
          [
            require('../generators/entity-client'),
            'jhipster-primeng-blueprint:entity-client',
            path.join(__dirname, '../generators/entity-client/index.js'),
          ],
        ])
        .withArguments(['foo'])
        .withPrompts({
          fieldAdd: false,
          relationshipAdd: false,
          dto: 'no',
          service: 'no',
          pagination: 'infinite-scroll',
        })
        .on('end', done);
    });

    it('it works', () => {
      // we keep these tests for easier debugging of blueprints, it should always succeed
      // DO NOT add tests here
      assert.textEqual('Write your own tests!', 'Write your own tests!');
    });
  });
});
