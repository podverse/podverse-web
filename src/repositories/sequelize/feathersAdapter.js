const sqlEngineFactory = require('repositories/sequelize/engineFactory.js');
const configureModels = require('./models');

module.exports = function () {
  const app = this,
    databaseName = app.get('databaseName'),
    storagePath = app.get('sqlite');

  const sqlEngine = sqlEngineFactory({databaseName, storagePath}),
    models = configureModels(sqlEngine);

  sqlEngine.sync();

  app.set('sequelize', sqlEngine);
  app.set('sequelizeModels', models);
};
