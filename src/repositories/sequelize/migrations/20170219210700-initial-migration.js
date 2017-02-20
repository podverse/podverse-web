const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {

    let initialSql = readFileSync(__dirname + '/initial.sql', 'utf-8');

    queryInterface.sequelize.query(initialSql, {
      raw: true, type: Sequelize.QueryTypes.RAW
    });

  },

  down: function (queryInterface) {
    return queryInterface.dropAllTables();
  }
}
