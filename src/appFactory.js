'use strict';

const feathers = require('feathers');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');

function appFactory ({podcastService}) {

  const app = feathers();

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .configure(rest())
    .configure(hooks())
    .use('podcasts', podcastService);

  return app;
}


module.exports = appFactory;
