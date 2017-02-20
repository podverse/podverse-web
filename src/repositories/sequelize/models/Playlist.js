const shortid = require('shortid');

'use strict';

module.exports = function(sequelize, DataTypes) {

  // Playlist should pretty much just have title and the author
  // There will be a way to retrieve related MediaRefs for
  // a given playlist.
  const playlist = sequelize.define('playlist', {

    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: function () {
        return shortid.generate();
      }
    },

    slug: {
      type: DataTypes.TEXT,
      unique: true,
      validation: {
        notEmpty: true
      }
      // TODO: the slug and primary keys must be mutally unique if URLs can use primary keys.
      // In that case a slug should never be able to be changed to an existing primary key
      // (unless it is the primary key for this clip);
      // do we need a "composite index"?
    },

    // url: appended to response body by PlaylistService hook

    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validation: {
        notEmpty: true
      }
    },

    ownerId: {
      type: DataTypes.TEXT,
      allowNull: false,
      validation: {
        notEmpty: true
      }
    },

    ownerName: DataTypes.TEXT,

    dateCreated: DataTypes.DATE,

    lastUpdated: DataTypes.DATE,

    isRecommendation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // TODO: An ownerId should only be able to have ONE playlist with isMyClips === true
    isMyClips: DataTypes.BOOLEAN

  }, {
      updatedAt: 'lastUpdated',
      createdAt: 'dateCreated',
      setterMethods: {
          podverseURL: function (value) {
              this.setDataValue('podverseURL', value);
          }
      }
  });

  return playlist;
};
