const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn(
      'mediaRefs',
      'isPublic',
      {
        type: Sequelize.BOOLEAN
      }
    );

  },

  down: function (queryInterface) {
    return queryInterface.dropAllTables();
  }
};
