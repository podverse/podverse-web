const {locator} = require('../../src/locator.js');

const appFactory = require('../../src/appFactory.js');
const {configureDatabaseModels} = require('../helpers.js');

const ClipService = require('../../src/services/clip/ClipService.js');


// TODO: disabling this test because it should be rewritten when we use access logs
// instead of Google Analytics for retrieving most popular clips
xdescribe('html test: index', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {

    locator.set('PlaylistService', new ClipService());
    locator.set('ClipService', new ClipService());

    this.app = appFactory();
  });

  xit('should be be 200 OK', function (done) {

    chai.request(this.app)
      .get(`/`)
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  // TODO
  xit('should return 10 clips');
  // TODO
  xit('should return the next 10 clips with page=2 passed in as the URL parameter');
});
