// Initializes the `photos` service on path `/photos`
const createService = require('feathers-sequelize');
const createModel = require('../../models/photos.model');
const hooks = require('./photos.hooks');
const filters = require('./photos.filters');

// Image upload requirements
const multer = require('multer');
const multipartMiddleware = multer();
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/photos');

// Google storage
// const storage = require('@google-cloud/storage');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'photos',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/photos', 
  // multipartMiddleware.single('uri'),
  //  (req, res, next) => {
  //   req.feathers.file = req.file;
  //   next();
  // }, blobService({Model: blobStorage}),
  createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('photos');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
