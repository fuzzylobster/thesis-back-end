require('dotenv').config();
const { CLIENT_ID, AUTH_SECRET } = process.env;

const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const authUtils = require('feathers-authentication/lib/utils');
const GoogleAuth = require('google-auth-library');
const Promise = require('bluebird');

const { hashPassword } = require('feathers-authentication-local').hooks;

const auth = new GoogleAuth;
const client = new auth.OAuth2(CLIENT_ID, '', '');

const feathers = require('feathers');
const app = feathers();
const rest = require('feathers-rest');


const verifyIdToken = hook => new Promise((resolve, reject) =>
  client.verifyIdToken(hook.data.token, CLIENT_ID, (e, login) => e ? reject(e) : resolve(login)));

const verifier = async (hook) => {
  try {
    const login = await verifyIdToken(hook);
    // Get payload and user id
    var { aud, sub: userID } = login.getPayload();
    // var userID = payload.sub;
    // If verify success
    if (aud === CLIENT_ID) {
      console.log('success! Aud:', aud, 'userid:', userID);
      // Include user id in custom JWT
      hook.params.payload = { userID };
      hook.params.authenticated = true;
      const jwt = await authUtils.createJWT(hook.params.payload, { secret: AUTH_SECRET });
      hook.data.jwtToken = jwt;
      hook.data.googleId = userID;
    }
    console.log(login, 'this is login');
    return hook;
  } catch (err) {
    console.log(err, 'Verification Error');
    return err;
  }
}


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ 
      // hook => {
      //   console.log(hook.data);
      //   if (hook.data.authType === 'google') {
      //     console.log('It\'s Google');
      //     return async client.verifyIdToken(
      //       hook.data.token,
      //       process.env.CLIENT_ID,
      //       function (e, login) {
      //         console.log(login);
      //         // If verify fails
      //         if (!login) {
      //           console.error('Login Failed');
      //         } // If verify success 
      //         else if (login) {
      //           // Get payload and user id
      //           var payload = login.getPayload();
      //           var userid = payload['sub'];
      //           // If verify success
      //           if (payload.aud === process.env.CLIENT_ID) {
      //             console.log('success! payload:', payload, 'userid:', userid);
      //             // Include user id in custom JWT
      //             hook.params.payload = {
      //               userID: userid
      //             };
      //             hook.params.authenticated = true;
      //             // Create the JWT
      //             // async
      //             let jwt = await authUtils.createJWT(hook.params.payload, { secret: process.env.AUTH_SECRET }).then((jwt) => {
      //               console.log('JWT success!', jwt);
                    
      //               // Send the JWT
      //               return jwt;
      //               // app.configure(rest((req, res) => {
      //               //   res.format({
      //               //     'text/plain': function () {
      //               //       res.end(jwt);
      //               //     }
      //               //   });
      //               // }));
      //             }).catch((error) => {
      //               console.log('JWT creation failed', error);
      //             });
      //             //await
      //             hook.data.jwtToken = jwt;
      //             hook.data.googleId = userid;
      //           } // If verify fails 
      //           else if (payload.aud !== process.env.CLIENT_ID) {
      //             console.error('Login failed');
      //           }
      //         }
      //       });
      //   }
      // }
      async hook => {
        console.log(hook.data);
        if (hook.data.authType === 'google') {
          var verify = await verifier(hook)
            .then(data => {
              console.log(data)
              return data;
            })
            .catch(err => {
              console.error(err);
              return err;
            });
        }
        return verify;
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
