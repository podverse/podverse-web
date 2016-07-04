'use strict';

// playlist-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const playlist = sequelize.define('playlists', {
    text: {
      type: Sequelize.STRING,
      allowNull: false
    },
    things: {
      type: Sequelize.STRING,
      allowNull: true
    },
    _slug: {
      type: Sequelize.STRING,
      allowNull: true
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true
  });

  playlist.sync();

  return playlist;
};
