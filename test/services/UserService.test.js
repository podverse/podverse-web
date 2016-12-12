const
    {configureDatabaseModels} = require('test/helpers.js'),
    UserService = require('services/user/UserService.js');

describe('UserService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {
    this.userSvc = new UserService();

    const {User} = this.Models;
    this.Model = User;
  });

  it('should go', function () {
    expect(this.userSvc).to.be.ok;
  });

  describe('when creating a user', function () {

    describe('and the user already exists', function () {
      beforeEach(function (done) {
        this.userSvc.create({}, {
          userId: 'rorschach'
        })
        .then(() => {
          return this.userSvc.create({}, {
            userId: 'rorschach'
          })
        })
        .then(user => {
          this.user = user;
          return this.Model.findAll();
        })
        .then(users => {
          this.users = users;
          done();
        })
      });

      it('then it should return the user', function () {
        expect(this.user.id).to.equal('rorschach');
      });

      it('then only one user should have been created', function () {
        expect(this.users.length).to.equal(1);
      });
    });

    describe(`and the user doesn't already exist`, function () {
      beforeEach(function (done) {
        this.userSvc.create({}, {
          userId: 'ozymandias'
        })
        .then(() => {
          return this.userSvc.create({}, {
            userId: 'drmanhattan'
          })
        })
        .then(user => {
          this.user = user;
          return this.Model.findAll();
        })
        .then(users => {
          this.users = users;
          done();
        })
      });

      it('then it should return the user', function () {
        expect(this.user.id).to.equal('drmanhattan');
      });

      it('then two users should have been created', function () {
        expect(this.users.length).to.equal(2);
      });
    });

  });

});
