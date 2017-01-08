const importModels = require('sequelize-import');

module.exports = function (sequelizeEngine) {

  // Load all the models
  const models = importModels(__dirname, sequelizeEngine, {
    exclude: ['index.js']
  });

  // Now relate them
  // ---------------

  const {MediaRef, Playlist, User} = models,
    playlistItemsName = 'playlistItems';

  Playlist.belongsToMany(MediaRef, {through: playlistItemsName}, {
    foreignKey: { allowNull: false }
  });

  MediaRef.belongsToMany(Playlist, {through: playlistItemsName}, {
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
