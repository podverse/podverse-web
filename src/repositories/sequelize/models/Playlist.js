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
      unique: true
      // TODO: the slug and primary keys must be mutally unique if URLs can use primary keys.
      // In that case a slug should never be able to be changed to an existing primary key
      // (unless it is the primary key for this clip);
      // do we need a "composite index"?
    },

    // url: appended to response body by PlaylistService hook

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
    },

    sharePermission: {
      type: DataTypes.ENUM('isPublic', 'isSharableWithLink', 'isPrivate')
    },


    // TODO: An ownerId can only have ONE playlist with isMyEpisodes === true
    isMyEpisodes: {
      type: DataTypes.BOOLEAN
    },

    // TODO: An ownerId can only have ONE playlist with isMyClips === true
    isMyClips: {
      type: DataTypes.BOOLEAN
    }

  }, {
      updatedAt: 'dateCreated',
      createdAt: 'lastUpdated',
      setterMethods: {
          podverseURL: function (value) {
              this.setDataValue('podverseURL', value);
          }
      }
  });

  return playlist;
};
