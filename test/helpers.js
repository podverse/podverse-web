const SqlEngine = require('repositories/sequelize/engineFactory.js');
const registerModels = require('repositories/sequelize/models');

const appFactory = require('appFactory.js');
const PodcastService = require('services/podcast/PodcastService.js');

const {createToken} = new (require('services/auth/AuthService.js'))();

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

function createTestApp (Models) {
  return appFactory({
    podcastService: new PodcastService({Models: Models})
  });
}

function createValidTestJWT () {
  beforeEach(function () {
    const fakeReq = {
      body: {
        username: 'curly@podverse.fm'
      }
    }

    this.token = createToken(fakeReq);
  });

  afterEach(function () {
    this.token = null;
  });
}

module.exports = {
  configureDatabaseModels,
  createTestApp,
  createValidTestJWT
};
