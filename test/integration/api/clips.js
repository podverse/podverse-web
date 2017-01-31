const {locator} = require('locator.js');

const appFactory = require('appFactory.js');
const {configureDatabaseModels,
       createTestApp,
       createTestUser,
       createValidTestJWT} = require('test/helpers.js');

const ClipService = require('services/clip/ClipService.js');
const PlaylistService = require('services/playlist/PlaylistService.js');

const config = require('config.js');

describe('API Test: Clips', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {
    createTestUser(this.Models)
      .then(user => {
        this.user = user;
        done();
      })
  });

  beforeEach(function () {
    this.app = createTestApp();
  });

  describe('when creating a clip by mediaURL/feedURL', function () {

    beforeEach(function (done) {

      const token = createValidTestJWT();

      chai.request(this.app)
        .post(`/clips`)
        .set(`Authorization`, token)
        .send({
          'title': 'jerry',
          'startTime': 3,
          'endTime': 10,
          'podcastTitle': 'testPodcastTitle234',
          'podcastFeedURL': 'http://something.com/rss',
          'episodeMediaURL': 'http://something.com/1.mp3',
          'episodeTitle': 'testEpisodeTitle22'
        })
        .end((err, res) => {
          this.response = res;
          done();
        });
    });

    it('should return 201', function () {
      expect(this.response.statusCode).to.equal(201);
    });

    it('should return the podverseURL', function () {
      let podverseURL = this.response.body.podverseURL,
          id = this.response.body.id;

      expect(podverseURL).to.equal(`${config.baseURL}/clips/${id}`);
    });

  });

  xit('should be able to get a clip', function () {

  });
});
