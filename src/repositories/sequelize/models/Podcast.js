'use strict';

module.exports = function(sequelize, DataTypes) {

  // Podcast primary key is it's RSS URL?
  
  const podcast = sequelize.define('podcast', {

    feedURL: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
        notEmpty:true
      }
    },

    imageURL: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
        notEmpty: true
      }
    },

    summary: DataTypes.TEXT,

    title: DataTypes.TEXT
  });

  return podcast;
};
