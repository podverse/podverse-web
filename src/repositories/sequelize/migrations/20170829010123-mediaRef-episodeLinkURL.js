const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn(
      'mediaRefs',
      'episodeLinkURL',
      {
        type: Sequelize.STRING
      }
    );

  },

  down: function (queryInterface) {
    return queryInterface.dropAllTables();
  }
};
