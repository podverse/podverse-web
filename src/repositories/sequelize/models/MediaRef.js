'use strict';

module.exports = function(sequelize, DataTypes) {

  // You could call this a clip or you could call it an episode.
  // I would consider if startTime && endTime are null, then it
  // is referencing the entire episode.

  const mediaRef = sequelize.define('mediaRef', {
    title: DataTypes.TEXT,
    startTime: DataTypes.INTEGER,
    endTime: DataTypes.INTEGER,

    // duriation is not needed, it's startTime - endTime;

    ownerId: DataTypes.TEXT
  });

  return mediaRef;
};
