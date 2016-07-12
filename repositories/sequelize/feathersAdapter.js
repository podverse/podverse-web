const sqlEngineFactory = require('repositories/sequelize/engineFactory.js');
const configureModels = require('./models');
const config = require('config');

module.exports = function () {
  // const app = this,
  const databaseName = config.databaseName,
    storagePath = config.sqlite;

  const sqlEngine = sqlEngineFactory({databaseName, storagePath}),
    models = configureModels(sqlEngine);

  sqlEngine.sync();

  const sequelizeObj = {engine: sqlEngine, models: models};

  return sequelizeObj;

};
