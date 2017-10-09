// Initializes the `thesisdb` service on path `/thesisdb`
const createService = require('feathers-sequelize');
const createModel = require('../../models/thesisdb.model');
const hooks = require('./thesisdb.hooks');
const filters = require('./thesisdb.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'thesisdb',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/thesisdb', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('thesisdb');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
