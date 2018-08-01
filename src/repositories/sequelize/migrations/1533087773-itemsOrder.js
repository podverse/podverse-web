const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    return queryInterface.addColumn(
      'playlists',
      'itemsOrder',
      {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
      }
    ).then(() => {
      done();
    });
  }
}
