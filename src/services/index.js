const thesisdb = require('./thesisdb/thesisdb.service.js');
const location = require('./location/location.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(thesisdb);
  app.configure(location);
};
