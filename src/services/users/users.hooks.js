require('dotenv').config();
const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const authUtils = require('feathers-authentication/lib/utils');
const GoogleAuth = require('google-auth-library');

const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id'
  })
];

const auth = new GoogleAuth;
const client = new auth.OAuth2(process.env.CLIENT_ID, '', '');


module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [ 
      // hashPassword()
      hook => {
        console.log(hook.data);
        if (hook.data.authType === 'google') {
          console.log('It\'s Google');
          client.verifyIdToken(
            hook.data.token,
            process.env.CLIENT_ID,
            function (e, login) {
              // If verify fails
              if (!login) {
                console.error('Login Failed');
              } // If verify success 
              else if (login) {
                // Get payload and user id
                var payload = login.getPayload();
                var userid = payload['sub'];
                // If verify success
                if (payload.aud) {
                  console.log('success! payload:', payload, 'userid:', userid);
                  // Include user id in custom JWT
                  hook.params.payload = {
                    userID: userid
                  };
                  hook.params.authenticated = true;
                  // Create the JWT
                  authUtils.createJWT(hook.params.payload, { secret: process.env.AUTH_SECRET }).then((jwt) => {
                    console.log('JWT success!', jwt);
                    return jwt;
                  }).catch((error) => {
                    console.log('JWT creation failed', error);
                  });
                  hook.data.googleId = userid;
                  console.log(hook.data);
                } // If verify fails 
                else if (!payload.aud) {
                  console.error('login failed');
                }
              }
            });
        }
      }
    ],
    update: [ ...restrict, hashPassword() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
