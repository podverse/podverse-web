'use strict';

module.exports = function(sequelize, DataTypes) {

  // Podcast primary key is it's RSS URL?

  const podcast = sequelize.define('podcast', {
    feedURL: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true,
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    summary: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    imageURL: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true,
        notEmpty: true
      }
    },
    itunesImageURL: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true,
        notEmpty: true
      }
    },
    iTunesAuthor: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    lastBuildDate: {
      type: DataTypes.DATE
    },
    lastPubDate: {
      type: DataTypes.DATE
    }
  });

  return podcast;
};
