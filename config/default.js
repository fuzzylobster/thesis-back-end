require('dotenv').config();
module.exports = {
  'host': process.env.HOST,
  'port': process.env.PORT,
  'public': '../public/',
  'paginate': {
    'default': 10,
    'max': 50
  },
  'postgres': process.env.CONNECTION,
  'authentication': {
    'secret': '',
    'strategies': [
      'jwt'
    ],
    'path': '/authentication',
    'service': 'users',
    'jwt': {
      'header': {
        'type': 'access'
      },
      'audience': 'https://yourdomain.com',
      'subject': 'anonymous',
      'issuer': 'feathers',
      'algorithm': 'HS256',
      'expiresIn': '1d'
    },
    'local': {
      'entity': 'user',
      'service': 'users',
      'usernameField': 'username',
      'passwordField': 'password',
      'session': 'true'
    },
    'google': {
      'clientID': '',
      'clientSecret': '',
      'successRedirect': '/',
      'scope': [
        'profile openid email'
      ]
    },
    'cookie': {
      'enabled': true,
      'name': 'feathers-jwt',
      'httpOnly': false,
      'secure': false
    }
  }
};
