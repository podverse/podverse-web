const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.addColumn(
      'mediaRefs',
      'pastHourTotalUniquePageviews',
      {
        type: Sequelize.INTEGER
      }
    );

    queryInterface.addColumn(
      'mediaRefs',
      'pastDayTotalUniquePageviews',
      {
        type: Sequelize.INTEGER
      }
    );

    queryInterface.addColumn(
      'mediaRefs',
      'pastWeekTotalUniquePageviews',
      {
        type: Sequelize.INTEGER
      }
    );

    queryInterface.addColumn(
      'mediaRefs',
      'pastMonthTotalUniquePageviews',
      {
        type: Sequelize.INTEGER
      }
    );

    queryInterface.addColumn(
      'mediaRefs',
      'pastYearTotalUniquePageviews',
      {
        type: Sequelize.INTEGER
      }
    );

    queryInterface.addColumn(
      'mediaRefs',
      'allTimeTotalUniquePageviews',
      {
        type: Sequelize.INTEGER
      }
    );

  },

  down: function (queryInterface) {
    return queryInterface.dropAllTables();
  }
};
