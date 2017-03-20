const
    {configureDatabaseModels, createTestPodcastAndEpisode} = require('test/helpers.js'),
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

  describe('#retrieveUserAndAllSubscribedPodcasts', function () {
    beforeEach(function (done) {

      createTestPodcastAndEpisode()
        .then(arr => {
          let podcast = arr[0],
              episode = arr[1];

          return this.userSvc.create({
            subscribedPodcastFeedURLs: [podcast.feedURL]
          }, {
            userId: 'nite_owl',
          })
        })
        .then(user => {
          this.user = user;
          return this.userSvc.retrieveUserAndAllSubscribedPodcasts(user.id, {userId: 'nite_owl'})
        })
        .then(userWithSubscribedPodcasts => {
          this.user = userWithSubscribedPodcasts;
          this.subscribedPodcasts = this.user.dataValues.subscribedPodcasts;
          done();
        })
        .catch(e => {
          console.log(e);
        })
    });

    describe('when the custom SQL query is called', function () {

      describe('for the subscribed podcasts that are returned', function() {

        it('should include the lastEpisodePubDate', function () {
          let pubDateTime1 = new Date(this.subscribedPodcasts[0].lastEpisodePubDate);
          let pubDateTime2 = new Date('2017-01-30T03:58:46.000Z');
          expect(pubDateTime1).to.equalDate(pubDateTime2);
        });

        it('should include the title', function () {
          expect(this.subscribedPodcasts[0].title).to.equal('Most interesting podcast in the world');
        });

        it('should include the imageURL', function () {
          expect(this.subscribedPodcasts[0].imageURL).to.equal('http://example.com/image.jpg');
        });
      })

    });

  })

});
