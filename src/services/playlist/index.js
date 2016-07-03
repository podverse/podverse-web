'use strict';

const service = require('feathers-sequelize');
const playlist = require('./playlist-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: playlist(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/playlists', service(options));

  // Get our initialize service to that we can bind hooks
  const playlistService = app.service('/playlists');

  // Set up our before hooks
  playlistService.before(hooks.before);

  // Set up our after hooks
  playlistService.after(hooks.after);
};
