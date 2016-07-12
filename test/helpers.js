const SqlEngine = require('repositories/sequelize/engineFactory.js');
const registerModels = require('repositories/sequelize/models');

function configureDatabaseModels (resolve) {

  beforeEach(function (done) {

    this._sqlEngine = new SqlEngine({storagePath: ':memory:'});
    const Models = registerModels(this._sqlEngine);

    this._sqlEngine.sync()
      .then(() => {
        resolve.apply(this, [Models]);
        done();
      });
  });

  afterEach(function (done) {
    this._sqlEngine.dropAllSchemas()
      .then(() => done());
  });
}

module.exports = {
  configureDatabaseModels
};
