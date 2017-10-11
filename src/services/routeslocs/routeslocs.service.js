// Initializes the `routeslocs` service on path `/routeslocs`
const createService = require('feathers-sequelize');
const createModel = require('../../models/routeslocs.model');
const hooks = require('./routeslocs.hooks');
const filters = require('./routeslocs.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'routeslocs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/routeslocs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('routeslocs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
