require('dotenv').config();
module.exports = {
  'host':  process.env.HOST,
  'port': process.env.PORT,
  'public': '../public/',
  'paginate': {
    'default': 10,
    'max': 50
  },
  'postgres': process.env.CONNECTION,
  'authentication': {
    'secret': '687bfdf73bb7c68e7e9b52a6ab1e110662c340869f880b331d90cfa3f7afc138ed83cb9a706da008983b86441e802aba949dc861a5799fee203ff702f606cf9d7858487442af549a1f3160301d56b041f5a53f411584fb63d6995efcbb3078bffbc5be9720b84a7c1c75cbe846d5a84b359e5c05940716440aa67d1430d1a7b44da2a7b084a5e94baa211d56ff7eeb428e0a9758bcdffee03d499c090f3574b4226f3c51e5a25e6dfceaf0bd2a7c1fe3f0135458fd8a29219f49e6bab7a04f8a7e758aec41f5b30389cb4e53e467d4af7167e63c2a1ca183d7695aa5d6758a1b99ab934592e27e4cf4f701949ca582db65195f56e2a73d8d0891dd69f30468cb',
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
