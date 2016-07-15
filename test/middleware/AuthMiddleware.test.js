const {configureDatabaseModels, createTestApp} = require('test/helpers.js');
const {checkIfAuthenticatedUser} = require('middleware/auth/AuthMiddleware.js');

describe('AuthMiddleware', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {
    this.app = createTestApp(this.Models);

    this.app
      .use('/test-auth', checkIfAuthenticatedUser)
      .use('/test-auth/get', (req, res) => {
        res.sendStatus(201, 'GET bypassed check');
      })
      .use('/test-auth/post', (req, res) => {
        res.sendStatus(202, 'POST bypassed check');
      })
  });

  describe('checkIfAuthenticatedUser', function () {

    it('should bypass middleware if a GET', function (done) {
      chai.request(this.app)
        .get('/test-auth/get')
        .end(function (err, res) {
          expect(res).to.have.status(201);
          done();
        });
    });

    it('should bypass middleware if a POST', function (done) {
      chai.request(this.app)
        .post('/test-auth/post')
        .end(function (err, res) {
          expect(res).to.have.status(202);
          done();
        });
    });

    describe('invalid JWT provided', function () {
      xit('should return Unauthorized if invalid JWT', function () {
      });
    });

    describe('valid JWT provided', function () {
      xit('should set a token on the req.feathers object', function () {
      });
      xit('should set a user on the req.feathers object', function () {
      });
    });

  });

});
