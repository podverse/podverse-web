const {configureDatabaseModels, createTestApp, createValidTestJWT} = require('test/helpers.js');
const {checkIfAuthenticatedUser} = require('middleware/auth/AuthMiddleware.js');
const Cookies = require('cookies');

describe('AuthMiddleware', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {
    this.app = createTestApp(this.Models);

    this.app
      .use('/test-auth', checkIfAuthenticatedUser)
      .use('/test-auth/get', (req, res) => {
        res.sendStatus(600, 'GET bypassed check');
      })
      .use('/test-auth/post', (req, res) => {
        res.sendStatus(601, 'POST bypassed check');
      })
      .use('/test-auth/put', (req, res) => {
        res.status(602, 'PUT was successful').send(req.feathers);
      })
      .use('/test-auth/patch', (req, res) => {
        res.status(603, 'PATCH was successful').send(req.feathers);
      })
  });

  describe('checkIfAuthenticatedUser', function () {

    it('should bypass middleware if a GET', function (done) {
      chai.request(this.app)
        .get('/test-auth/get')
        .end(function (err, res) {
          expect(res).to.have.status(600);
          done();
        });
    });

    it('should bypass middleware if a POST', function (done) {
      chai.request(this.app)
        .post('/test-auth/post')
        .end(function (err, res) {
          expect(res).to.have.status(601);
          done();
        });
    });

    describe('check the x-auth-token header', function () {
      createValidTestJWT();

      beforeEach(function() {
        this.request = chai.request(this.app)
          .put('/test-auth/put')
          .set('user-agent', 'Mobile App');
      });

      it('should respond with 401 Unauthorized', function (done) {
        this.request
          .set('x-auth-token', 'wrongtoken')
          .end(function (err, res) {
            expect(res).to.have.status(401)
            done();
          });
      });

      it('should call the next() function', function (done) {
        this.request
          .set('x-auth-token', this.token)
          .end(function (err, res) {
            expect(res).to.have.status(602);
            done();
          });
      });

      it('should set a token on the req.feathers object', function (done) {
        this.request
          .set('x-auth-token', this.token)
          .end(function (err, res) {
            expect(res).to.have.status(602);
            expect(res.body.token).to.exist;
            done();
          });
      });

      it('should set a user on the req.feathers object', function (done) {
        this.request
          .set('x-auth-token', this.token)
          .end(function (err, res) {
            expect(res).to.have.status(602);
            expect(res.body.user).to.equal('curly@podverse.fm');
            done();
          });
      });

    });

    describe('check the access_token session cookie', function () {

      beforeEach(function () {
        this.request = chai.request(this.app)
          .put('/test-auth/put');
      });

      describe('if wrong token is provided', function () {
        it('it should respond with 401 Unauthorized', function (done) {
          this.request
            .set('Cookie', 'access_token=wrongtoken')
            .end(function (err, res) {
              expect(res).to.have.status(401);
              done();
            });
        });
      });

      describe('if valid token is provided', function () {
        createValidTestJWT();

        beforeEach(function () {
          this.authenticatedRequest = this.request
            .set('Cookie', 'access_token=' + this.token);
        });

        it('should call the next() function', function (done) {
          this.authenticatedRequest
            .end(function (err, res) {
              expect(res).to.have.status(602);
              done();
            });
        });

        it('should set a token on the req.feathers object', function (done) {
          this.authenticatedRequest
            .end(function (err, res) {
              expect(res).to.have.status(602);
              expect(res.body.token).to.exist;
              done();
            });
        });

        it('should set a user on the req.feathers object', function (done) {
          this.authenticatedRequest
            .end(function (err, res) {
              expect(res).to.have.status(602);
              expect(res.body.user).to.equal('curly@podverse.fm');
              done();
            });
        });

      });

    });

  });

});
