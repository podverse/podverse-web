const {locator} = require('locator.js');

const appFactory = require('appFactory.js');
const {configureDatabaseModels} = require('test/helpers.js');

const ClipService = require('services/clip/ClipService.js');

describe('html test: index', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {

    locator.set('PlaylistService', new ClipService());
    locator.set('ClipService', new ClipService());

    this.app = appFactory();
  });

  it('should be be 200 OK', function (done) {

    chai.request(this.app)
      .get(`/`)
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });

  });
});
