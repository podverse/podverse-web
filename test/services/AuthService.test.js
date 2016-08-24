const {configureDatabaseModels, createTestApp} = require('test/helpers.js');
const {returnJWTInResponseIfValidUsernameAndPassword} = require('services/auth/AuthService.js');

describe('AuthService', function () {

  configureDatabaseModels(function(Models) {
    this.Models = Models;
  })

  beforeEach(function () {
    this.app = createTestApp(this.Models);
  });

  describe('invalid credentials provided', function () {

    it('should return an anonymous JWT token', function (done) {
      chai.request(this.app)
        .post('/auth/anonLogin')
        .end(function (err, res) {
          expect(res.body).to.exist;
          done();
        })
    });

  });

});
