const {configureDatabaseModels, createTestApp} = require('test/helpers.js');
const requireAPISecret = require('middleware/apiSecret/APISecretMiddleware.js');
const config = require('config.js');

describe('AuthMiddleware', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {
    this.app = createTestApp(this.Models);

    this.app
      .use('/test-api-secret', requireAPISecret)
      .use('/test-api-secret', (req, res) => {
        res.sendStatus(600, 'passed the test');
      })
  });

  describe('APISecretMiddleware', function () {

    it('should throw error if secret key is not provided', function (done) {
      chai.request(this.app)
        .get('/test-api-secret')
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should pass through middleware if secret key is provided', function (done) {
      chai.request(this.app)
        .get('/test-api-secret')
        .set('Authorization', config.apiSecret)
        .end(function (err, res) {
          expect(res).to.have.status(600);
          done();
        });
    });

  });

});
