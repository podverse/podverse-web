const checkJWT = require('middleware/auth/checkJWT.js');
const {createValidTestJWT} = require('test/helpers.js');

describe('checkJWT Middleware', function () {

  describe('when there is a JWT in the header', function () {

    describe('when the JWT is valid', function () {

      xit('should set the user identifier on req.feathers.userId', function () {

      });

    });

    describe('when the JWT is invalid', function () {

      xit('should throw an unauthorized error', function () {

      });
    });

  });

  xdescribe('when there is a JWT in a cookie', function () {
    // TODO: later, if ever.
  });

});
