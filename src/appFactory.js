'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');

const bodyParser = require('body-parser');

const {locator} = require('locator.js');
const {checkJWT} = require('middleware/auth/checkJWT.js');
const AuthService = new (require('services/auth/AuthService.js'))();

function appFactory () {

  const app = feathers();

  app
    .configure(rest())
    .configure(hooks())

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .use(checkJWT)

    .use('clips', locator.get('ClipService'))
    .use('playlists', locator.get('PlaylistService'))

    .post('/auth', function(req, res) {
      AuthService.returnJWTInResponseIfValidUsernameAndPassword(req, res);
    });

  return app;
}


module.exports = appFactory;
