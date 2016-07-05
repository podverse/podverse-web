'use strict';

// playlist-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const playlist = sequelize.define('playlists', {
    title: {
      type: Sequelize.STRING
    },
    _slug: {
      type: Sequelize.STRING,
      unique: true
      // TODO: the _slug and primary keys must be mutally unique.
      // A _slug should never be the same as an existing primary key, and vice versa.
    },
    url: {
      type: Sequelize.STRING,
    }
  }, {
    freezeTableName: true
  });

  playlist.sync();

  return playlist;
};
