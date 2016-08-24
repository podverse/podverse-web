const Sequelize = require('sequelize');

module.exports = function ({ databaseName='podverse', storagePath='podverse.sql' } = {}) {

  const sequelize = new Sequelize(databaseName, null, null, {
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });

  return sequelize;
};
