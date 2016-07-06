'use strict';

const hooks = require('./hooks');

const PlaylistService = require('./PlaylistService');

module.exports = function(){

  const app = this;

  const {Playlist} = app.get('sequelizeModels');

  const options = {
    Model: Playlist,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/playlists', new PlaylistService(options));

  // Get our initialize service to that we can bind hooks
  const playlistService = app.service('/playlists');

  // Set up our before hooks
  playlistService.before(hooks.before);

  // Set up our after hooks
  playlistService.after(hooks.after);
};
