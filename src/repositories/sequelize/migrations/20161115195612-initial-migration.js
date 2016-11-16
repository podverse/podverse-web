const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {
    
    return readFileSync(__dirname + '/initial.sql', 'utf-8')
      .split(';')
      .reduce((promise, statement) => {

        if(/^\s*$/.test(statement)) {return promise;}

        return promise.then(() => {
          return queryInterface.sequelize.query(statement, 
          { raw: true, type: Sequelize.QueryTypes.RAW});
        });

      }, Promise.resolve());
  
  },

  down: function (queryInterface) {
    return queryInterface.dropAllTables();
  }
};
