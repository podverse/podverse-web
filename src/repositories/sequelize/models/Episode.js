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
    summary: {
      type: DataTypes.TEXT,
      validation: {
        notEmpty: true
      }
    },
    duration: {
      type: DataTypes.INTEGER
      // TODO: do we need to ensure this is a positive integer?
    },
    guid: {
      type: DataTypes.UUID,
      unique: true
    },
    link: { // provided by the <link> field in podcast RSS feeds for episodes
      type: DataTypes.TEXT,
      validation: {
        isUrl: true,
        notEmpty: true
      }
    },
    mediaBytes: {
      type: DataTypes.INTEGER
      // TODO: do we need to ensure this is a positive integer?
    },
    mediaType: {
      // TODO: this should always be like 4-12 letters. should we use a string
      // instead (default max 255 chars)? Or should we just make them all TEXT
      // for consistency?
      type: DataTypes.TEXT,
      validation: {
        notEmpty: true
      }
    },
    pubDate: {
      type: DataTypes.DATE
    }
  });

  return episode;
};
