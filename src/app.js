require('dotenv').config();
const path = require('path');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');


const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const sequelize = require('./sequelize');

const authentication = require('./authentication');

// Image upload additions
// const serveStatic = require('feathers').static;
const Multer = require('multer');
// const multipartMiddleware = multer();
// const dauria = require('dauria');
// const blobService = require('feathers-blob');
// const fs = require('fs-blob-store');
const imgUpload = require('../imgUpload');

// Google storage
// const storage = require('@google-cloud/storage');

// const blobStorage = storage({
//   projectId: '',
//   keyFileName: ''
// });

// const blobStorage = fs(__dirname + '/image-upload');

const multer = Multer(
  {
  storage: Multer.memoryStorage()
  }
);

const app = feathers();

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

app.post('/image-upload', 
multer.single('image'), 
imgUpload.uploadToGcs, 
function (request, response, next) {
  console.log('request.file', request.files);
  // console.log('request', request);
  const data = request.body;             
  if (request.file && request.file.cloudStoragePublicUrl) {
    data.imageUrl = request.file.cloudStoragePublicUrl;
  }
  console.log(data);
  response.send(data);
})

// Set up Plugins and providers
app.configure(hooks());
app.configure(sequelize);
app.configure(rest());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);

// Set up our services (see `services/index.js`)
app.configure(services);

// // Configure auth
// app.configure(authentication);

// Configure a middleware for 04s and the error handler
app.use(notFound());
app.use(handler());

app.hooks(appHooks);

module.exports = app;