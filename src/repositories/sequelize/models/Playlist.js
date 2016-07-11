'use strict';

module.exports = function(sequelize, DataTypes) {

  // Playlist should pretty much just have title and the author
  // There will be a way to retrieve related MediaRefs for
  // a given playlist.
  const playlist = sequelize.define('playlist', {
    _slug: {
      type: DataTypes.TEXT,
      unique: true,
      validation: {
        notEmpty: true
      }
      // TODO: the _slug and primary keys must be mutally unique if URLs can use primary keys.
      // In that case a _slug should never be the same as an existing primary key, and vice versa.
    },
    url: {
      type: DataTypes.TEXT,
      validation: {
        isUrl: true,
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.TEXT,
      validation: {
        notEmpty: true
      }
    },
    lastUpdated: {
      type: DataTypes.DATE
    }
  });

  return playlist;
};
