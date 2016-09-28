'use strict';

module.exports = function(sequelize, DataTypes) {

  const user = sequelize.define('user', {

    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    subscribedPodcasts: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },

    autodownloadedPodcasts: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },

    subscribedPlaylists: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    }

  });

  return user;

}
