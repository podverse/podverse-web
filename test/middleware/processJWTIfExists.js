const processJWTIfExists = require('middleware/auth/processJWTIfExists.js');
const {createValidTestJWT} = require('test/helpers.js');
const config = require('config.js');

describe('processJWTIfExists Middleware', function () {

  describe('when there is a JWT in the header', function () {

    describe('when the JWT is valid', function () {

      xit('should set the user identifier on req.feathers.userId', function () {

      });

    });

    describe('when the JWT is invalid', function () {

      // TODO: I would prefer to just use the AuthService.createToken method to create
      // an invalid token, but the createToken function currently always uses
      // the correct config.apiSecret. Is there a way to use the existing AuthService.createToken
      // method, but swap out the config.apiSecret it uses with a wrong apiSecret value?
      // If yes, would we want to do that here?

      xit('should throw an unauthorized error', function () {

      });
    });

  });

  xdescribe('when there is a JWT in a cookie', function () {
    // TODO: later, if ever.
  });

});
