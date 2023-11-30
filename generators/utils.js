function prepareFineGrainedPermissions(generator) {
  return (generator.application.fineGrainedPermissions = generator.jhipsterConfig.blueprints.some(
        b => b.name === 'generator-jhipster-preauthorize'
    ));
}

module.exports = {
  prepareFineGrainedPermissions
};
