"use strict";

let
    PlaylistService=  require('./PlaylistService.js'),
    feathersAdapter = require('repositories/sequelize/feathersAdapter.js')();

module.exports = function playlistServiceFactory () {

  const {Playlist} = feathersAdapter.models;
  const options = {
    Model: Playlist,
    paginate: {
      default: 5,
      max: 25
    }
  }

  return new PlaylistService(options);
};
