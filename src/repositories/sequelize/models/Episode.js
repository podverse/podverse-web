'use strict';

module.exports = function(sequelize, DataTypes) {

  // You could call this a clip or you could call it an episode.
  // I would consider if startTime && endTime are null, then it
  // is referencing the entire episode.

  const episode = sequelize.define('episode', {
    // TODO: is notEmpty = true already the default value?
    // If yes we can remove it in all the models.
    mediaURL: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validation: {
        isUrl: true
      }
    },

    imageURL: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true
      }
    },

    title: DataTypes.TEXT,

    summary: DataTypes.TEXT,

    duration: DataTypes.INTEGER,

    guid: {
      type: DataTypes.UUID,
      unique: true
    },

    link: { // provided by the <link> field in podcast RSS feeds for episodes
      type: DataTypes.TEXT,
      validation: {
        isUrl: true
      }
    },

    mediaBytes: DataTypes.INTEGER, // TODO: do we need to ensure this is a positive integer?

    mediaType: DataTypes.TEXT,

    pubDate: DataTypes.DATE

  }, {
      updatedAt: 'lastUpdated',
      createdAt: 'dateCreated'
  });

  return episode;
};
