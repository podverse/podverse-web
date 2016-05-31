"use strict";

let
    PlaylistService=  require('./PlaylistService.js'),
    playlistDataStore = require('./DataStores/playlistDataStore.js');

module.exports = function playlistServiceFactory () {

  playlistDataStore.ensureIndex({fieldName: '_slug', unique: true});

  return new PlaylistService({Model: playlistDataStore});
};
