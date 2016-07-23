'use strict';

module.exports = function(sequelize, DataTypes) {

  // Playlist should pretty much just have title and the author
  // There will be a way to retrieve related MediaRefs for
  // a given playlist.
  const playlist = sequelize.define('playlist', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },

    slug: {
      type: DataTypes.TEXT,
      unique: true,
      validation: {
        notEmpty: true
      }
      // TODO: the slug and primary keys must be mutally unique if URLs can use primary keys.
      // In that case a slug should never be the same as an existing primary key, and vice versa.
    },

    title: {
      type: DataTypes.TEXT,
      validation: {
        notEmpty: true
      }
    },

    ownerId: {
      type: DataTypes.TEXT,
      allowNull: false,
      validation: {
        notEmpty: true,
      }
    },

    dateCreated: {
      type: DataTypes.DATE
    },

    lastUpdated: {
      type: DataTypes.DATE
    }

  });

  return playlist;
};
