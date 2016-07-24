const processJWTIfExists = require('middleware/auth/processJWTIfExists.js');
const appFactory = require('appFactory.js')
const {createValidTestJWT} = require('test/helpers.js');
const config = require('config.js');

describe('processJWTIfExists Middleware', function () {

  beforeEach(function () {
    this.app = appFactory();

    this.app
      .get('/test-jwt', function (req, res) {
        if (req.feathers.userId === undefined) {
          res.status(600, 'No authorization header was provided.').send();
        } else {
          res.status(200).send(req.feathers);
        }
      });

      this.request = chai.request(this.app)
        .get('/test-jwt');
  });

  describe('when there is undefined in the authorization header', function () {

    beforeEach(function (done) {
      this.request
        .end((err, res) => {
          this.response = res;
          done();
        });
    });

    it('should immediately call next()', function () {
      expect(this.response).to.have.status(600);
    });

  });

  describe('when there is a JWT in the authorization header', function () {

    describe('when the JWT is valid', function () {

      beforeEach(function (done) {
        this.validToken = createValidTestJWT();

        this.request
          .set('Authorization', this.validToken)
          .end((err, res) => {
            this.response = res;
            done();
          });
      });

      it('should set the user identifier on req.feathers.userId', function () {
        expect(this.response.body.userId).to.equal('curly@podverse.fm');
      });

    });

    describe('when the JWT is invalid', function () {

      // TODO: I would prefer to just use the AuthService.createToken method to create
      // an invalid token, but the createToken function currently always uses
      // the correct config.apiSecret. Is there a way to use the existing AuthService.createToken
      // method, but swap out the config.apiSecret it uses with a wrong apiSecret value?
      // If yes, would we want to do that here?

      beforeEach(function (done) {
        this.invalidToken = 'the price is wrong bob';

        this.request
          .set('Authorization', this.invalidToken)
          .end((err, res) => {
            this.response = res;
            done();
          });
      });

      it('should throw an unauthorized error', function () {
        expect(this.response.status).to.equal(401);
      });
    });

  });

  xdescribe('when there is a JWT in a cookie', function () {
    // TODO: later, if ever.
  });

});
