const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn(
      'users',
      'nickname',
      Sequelize.TEXT
    );

  },

  down: function (queryInterface) {
    return queryInterface.dropAllTables();
  }
}
