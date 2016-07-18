'use strict';

module.exports = function(sequelize, DataTypes) {

  // You could call this a clip or you could call it an episode.
  // I would consider if startTime && endTime are null, then it
  // is referencing the entire episode.

  const mediaRef = sequelize.define('mediaRef', {
    // URL to the mediaRef on Podverse, unique...but should it also be required?
    clipUrl: {
      type: DataTypes.TEXT,
      unique: true,
      validation: {
        isUrl: true,
        notEmpty: true
      }
    },
    // TODO: How about we allow people to set as many start-endtimes as they want
    // for mediaRefs? That way we could send each other "clips" that are a series
    // of moments from the show, meant to be played in that order.
    // Should we account for an array of start-end times in the mediaRef model now?

    // TODO: do we need to ensure these are positive integers?
    startTime: {
      type: DataTypes.INTEGER
    },
    endTime: {
      type: DataTypes.INTEGER
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
    }
  });

  return mediaRef;
};
