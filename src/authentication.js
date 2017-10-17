require('dotenv').config();
const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');

const GoogleAuth = require('google-auth-library');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  const auth = new GoogleAuth;
  const client = new auth.OAuth2(process.env.CLIENT_ID, '', '');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      all: [],
      create: [
        hook => {
          // Response data
          console.log(hook.data);
          // If coming from google
          if (hook.data.authType === 'google') {
            console.log('it\'s google');
            // Verify
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
                    app.passport.createJWT(hook.params.payload, { secret: process.env.AUTH_SECRET }).then((jwt) => {
                      console.log('JWT success!', jwt);
                      return jwt;
                    }).catch((error) => {
                      console.log('JWT creation failed', error);
                    });
                  } // If verify fails 
                  else if (!payload.aud) {
                    console.error('login failed');
                  }
                }
              });
          } if (hook.data.authType === 'facebook') {
            console.log('it\s facebook', hook.data.token);
            const inputToken = hook.data.token;
            const appToken = process.env.APP_TOKEN;
            const fbConnect = `graph.facebook.com/debug_token?
     input_token=${inputToken}
     &access_token={app-token-or-admin-token}`;
            app.get(fbC);
          }
        },
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
    // after: {
    //   create: [hook => {
    //     console.log('AFTER HOOK', hook.params)
    //   }]
    // }
  });
};
