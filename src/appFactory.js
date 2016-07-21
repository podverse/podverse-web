'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');

const bodyParser = require('body-parser');

const requireAPISecret = require('middleware/apiSecret/APISecretMiddleware.js');
const {checkIfAuthenticatedUser} = require('middleware/auth/AuthMiddleware.js');
const AuthService = new (require('services/auth/AuthService.js'))();

function appFactory ({podcastService, playlistService}) {

  const app = feathers();

  app
    .configure(rest())
    .configure(hooks())

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .use('/podcasts', podcastService)

    .use('/playlists', playlistService)

    .post('/auth', function(req, res) {
      AuthService.returnJWTInResponseIfValidUsernameAndPassword(req, res);
    });

  return app;
}


module.exports = appFactory;
