require('dotenv').config();
module.exports = {
  'host':  process.env.HOST,
  'port': process.env.PORT,
  'public': '../public/',
  'paginate': {
    'default': 10,
    'max': 50
  },
  'postgres': process.env.CONNECTION
};
