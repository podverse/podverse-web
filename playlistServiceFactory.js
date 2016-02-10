"use strict";

let
    PlaylistService=  require('./PlaylistService.js'),
    NeDB = require('nedb');

module.exports = function playlistServiceFactory () {

  const db = new NeDB({
    filename: './playlists.db',
    autoload: true
  });

  db.ensureIndex({fieldName: '_slug', unique: true});

  return new PlaylistService({Model: db});
}
