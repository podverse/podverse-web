const importModels = require('sequelize-import');

module.exports = function (sequelizeEngine) {

  // Load all the models
  const models = importModels(__dirname, sequelizeEngine, {
    exclude: ['index.js']
  });

  // Now relate them
  // ---------------

  const {Podcast, Episode, MediaRef, Playlist, User} = models,
    playlistItemsName = 'playlistItems';

  Podcast.hasMany(Episode);
  Episode.belongsTo(Podcast, {
    foreignKey: { allowNull: false }
  });

  MediaRef.belongsTo(Episode, {
    foreignKey: { allowNull: false }
  });

  Playlist.belongsToMany(MediaRef, {through: playlistItemsName}, {
    foreignKey: { allowNull: false }
  });

  MediaRef.belongsToMany(Playlist, {through: playlistItemsName}, {
    foreignKey: { allowNull: false }
  });

  User.belongsToMany(Podcast, {
    through: 'subscribedPodcasts'
  }, {
    foreignKey: { allowNull: false }
  });

  User.belongsToMany(Playlist, {
    through: 'subscribedPlaylists'
  }, {
    foreignKey: { allowNull: false }
  });

;

  return models;
};
