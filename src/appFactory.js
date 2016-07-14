'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');

const {checkIfAuthenticatedUser} = require('middleware/auth/AuthMiddleware.js');

function appFactory ({podcastService}) {

  const app = feathers();

  app
    .configure(rest())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .use('/podcasts', podcastService)

    // TODO: handle this outside of the appFactory
    .use('/test-auth', checkIfAuthenticatedUser)
    .use('/test-auth', (req, res) => {
      res.sendStatus(200, 'Authentication Passed');
    });

  return app;
}


module.exports = appFactory;
