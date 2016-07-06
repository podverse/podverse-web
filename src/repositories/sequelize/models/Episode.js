'use strict';

module.exports = function(sequelize, DataTypes) {

  // You could call this a clip or you could call it an episode.
  // I would consider if startTime && endTime are null, then it
  // is referencing the entire episode.

  const episode = sequelize.define('episode', {

  });

  return episode;
};
