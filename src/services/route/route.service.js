// Initializes the `route` service on path `/route`
const createService = require('feathers-sequelize');
const createModel = require('../../models/route.model');
const hooks = require('./route.hooks');
const filters = require('./route.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'route',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/route', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('route');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
