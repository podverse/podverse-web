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

    it('should return 401 if no credentials provided', function(done) {
      chai.request(this.app)
        .post('/auth')
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 if invalid username provided', function(done) {
      chai.request(this.app)
        .post('/auth')
        .send({username: 'shemp@podverse.fm', password: 'free access'})
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 401 if invalid password provided', function(done) {
      chai.request(this.app)
        .post('/auth')
        .send({username: 'moe@podverse.fm', password: 'wrong password'})
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });

  });

  describe('valid credentials provided', function () {

    it('should return token in JSON response', function (done) {
      chai.request(this.app)
        .post('/auth')
        .send({username: 'larry@podverse.fm', password: 'free access'})
        .end(function (err, res) {
          expect(res.body.token).to.exist;
          done();
        });
    });

  });

});
