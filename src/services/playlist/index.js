'use strict';

const service = require('feathers-sequelize');
const playlist = require('./playlist-model');
const hooks = require('./hooks');
const errors = require('feathers-errors').default;
const _ = require('lodash');
const uuid = require('uuid');

const PlaylistService = require('./PlaylistService');

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
  app.use('/playlists', new PlaylistService(options));

  // Get our initialize service to that we can bind hooks
  const playlistService = app.service('/playlists');

  // Set up our before hooks
  playlistService.before(hooks.before);

  // Set up our after hooks
  playlistService.after(hooks.after);
};
