const {processJWTIfExists} = require('middleware/auth/processJWTIfExists.js');
const {createValidTestJWT} = require('test/helpers.js');
const errors = require('feathers-errors');
const nJwt = require('njwt');

function createInvalid () {
  return nJwt.create({}, 'crap').compact();
}

describe('processJWTIfExists Middlewareee', function () {

  beforeEach(function () {

    this.nextSpy = this.sinon.spy();

    this.stub = {
      req: {
        headers: {
          authorization: 'invalid'
        },
        cookies: {
          idToken: null
        }
      }
    };

  });

  describe('when there is no authorization header or cookies.idToken', function () {

    beforeEach(function () {

      delete this.stub.req.headers.authorization;
      processJWTIfExists(this.stub.req, this.stub.res, this.nextSpy);

    });

    it('should not error', function () { /* eh, implied */ });

    it('should call next()', function () {
      expect(this.nextSpy.calledOnce).to.equal(true);
    });

    it('should not have userId set', function () {
      expect(this.stub.req.feathers.userId).to.not.be.ok;
    });
  });

  describe('when there is a JWT in the authorization header', function () {

    describe('when the JWT is valid', function () {

      beforeEach(function () {
        this.stub.req.headers.authorization = createValidTestJWT();
        processJWTIfExists(this.stub.req, this.stub.res, this.nextSpy);
      });

      it('should set the user identifier on req.feathers.userId', function () {
        expect(this.stub.req.feathers.userId).to.equal('kungfury@podverse.fm');
      });

    });

  });

  xdescribe('when there is a JWT in a cookie', function () {
    // TODO: later
  });

});
