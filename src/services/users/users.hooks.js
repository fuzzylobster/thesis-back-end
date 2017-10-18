require('dotenv').config();
const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const authUtils = require('feathers-authentication/lib/utils');
const GoogleAuth = require('google-auth-library');
const Promise = require('bluebird');

const { hashPassword } = require('feathers-authentication-local').hooks;

const auth = new GoogleAuth;
const client = new auth.OAuth2(process.env.CLIENT_ID, '', '');

const feathers = require('feathers');
const app = feathers();
const rest = require('feathers-rest');


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // hook => {
      //   const verifyGoogle = client.verifyIdToken;
      //   Promise.promisify(verifyGoogle, hook.data.token, process.env.CLIENT_ID).then((e, login) => {
      //     if (!login) {
      //       console.error('Login Failed');
      //     } else {
      //       var payload = login.getPayload();
      //       var userid = payload['sub'];
      //       if (payload.aud) {
      //         hook.params.payload = {
      //           userID: userid
      //         };
      //         hook.params.authenticated = true;
      //         hook.data.googleId = userId;
      //       }
      //     }
      //   }).then(authUtils.createJWT(hook.params.payload, { secret: process.env.AUTH_SECRET })).then(jwt => {
      //     hook.data.jwtToken = jwt;
      //   });
      // } 
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
                  // async
                  const generateJWT = async () => {
                    authUtils.createJWT(hook.params.payload, { secret: process.env.AUTH_SECRET }).then((jwt) => {
                    console.log('JWT success!', jwt);
                    // Send the JWT
                    return jwt;
                    // app.configure(rest((req, res) => {
                    //   res.format({
                    //     'text/plain': function () {
                    //       res.end(jwt);
                    //     }
                    //   });
                    // }));
                  }).catch((error) => {
                    console.log('JWT creation failed', error);
                  });
                };            
                //await
                  const sendData = async () => {
                    hook.data.jwtToken = await generateJWT();
                    hook.data.googleId = userid;
                    console.log('inside async', hook.data);
                  }
                  sendData();
                  console.log('outside async', hook.data);
                } // If verify fails 
                else if (!payload.aud) {
                  console.error('Login failed');
                }
              }
            });
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
