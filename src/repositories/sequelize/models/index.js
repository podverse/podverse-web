const importModels = require('sequelize-import');

module.exports = function (sequelizeEngine) {

  // Load all the models
  const models = importModels(__dirname, sequelizeEngine, {
    exclude: ['index.js']
  });

  // Now relate them
  // ---------------

  const {Podcast, Episode, MediaRef, Playlist} = models,
    playlistItemsName = 'playlistItems';

  Episode.belongsTo(Podcast, {
    foreignKey: { allowNull: false }
  });

  MediaRef.belongsTo(Episode);

  Playlist.belongsToMany(MediaRef, {through: playlistItemsName}, {
    foreignKey: { allowNull: false }
  });

  MediaRef.belongsToMany(Playlist, {through: playlistItemsName}, {
    foreignKey: { allowNull: false }
  });

  return models;
};
