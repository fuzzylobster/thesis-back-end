const thesisdb = require('./thesisdb/thesisdb.service.js');
const location = require('./location/location.service.js');
const users = require('./users/users.service.js');
const route = require('./route/route.service.js');
const routeslocs = require('./routeslocs/routeslocs.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(thesisdb);
  app.configure(location);
  app.configure(users);
  app.configure(route);
  app.configure(routeslocs);
};
