'use strict';

module.exports = function(sequelize, DataTypes) {

  // Podcast primary key is it's RSS URL?

  const podcast = sequelize.define('podcast', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },

    feedURL: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true
      }
    },

    imageURL: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true
      }
    },

    summary: DataTypes.TEXT,

    title: DataTypes.TEXT,

    author: DataTypes.TEXT,

    lastBuildDate: DataTypes.DATE,

    lastPubDate: DataTypes.DATE

  }, {
      updatedAt: 'lastUpdated',
      createdAt: 'dateCreated'
  });

  return podcast;
};
