'use strict';

const feathers = require('feathers');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');

const {locator} = require('locator.js');

function appFactory () {

  const app = feathers();

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .configure(rest())
    .configure(hooks())
    //.use('podcasts', locator.get('PodcastService'))
    //.use('episodes', locator.get('EpisodeService'))

    // Temporary auth
    .use((req, res, next) => {
      req.feathers.userId = 'temporary';
      next();
    })


    .use('clips', locator.get('ClipService'))
    .use('playlists', locator.get('PlaylistService'));

  return app;
}


module.exports = appFactory;
