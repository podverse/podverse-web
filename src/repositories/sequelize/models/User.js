'use strict';

module.exports = function(sequelize, DataTypes) {

  const user = sequelize.define('user', {

    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    name: {
      type: DataTypes.TEXT
    },

    // Nickname is the name that Auth0 provides automatically if the user does
    // not provide a name. The default value is the user's email address minus
    // after the @ sign.
    nickname: {
      type: DataTypes.TEXT
    },

    subscribedPodcastFeedURLs: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    }

  });

  return user;

}
