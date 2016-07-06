'use strict';

module.exports = function(sequelize, DataTypes) {

  // Playlist should pretty much just have title and the author
  // There will be a way to retrieve related MediaRefs for
  // a given playlist.
  const playlist = sequelize.define('playlist', {
    title: DataTypes.TEXT
  });

  return playlist;
};
