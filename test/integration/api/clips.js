const {locator} = require('locator.js');

const appFactory = require('appFactory.js');
const {configureDatabaseModels,
       createTestApp,
       createTestUser,
       createValidTestJWT,
       createTestPodcastAndEpisodeAndFeedUrl} = require('test/helpers.js');

const ClipService = require('services/clip/ClipService.js');
const PlaylistService = require('services/playlist/PlaylistService.js');

const config = require('config.js');

describe('API Test: Clips', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {
    createTestPodcastAndEpisodeAndFeedUrl()
      .then(arr => {
        // podcast and episode must exist for EpisodeService.validateMediaUrl
        let podcast = arr[0],
            episode = arr[1];

        createTestUser(this.Models)
          .then(user => {
            this.user = user;
            done();
          })

      });
  });

  beforeEach(function () {
    this.app = createTestApp();
  });

  describe('when creating a clip by mediaUrl/feedUrl', function () {

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
          'podcastFeedUrl': 'http://something.com/rss',
          'episodeMediaUrl': 'http://something.com/1.mp3',
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

    it('should return the podverseUrl', function () {
      let podverseUrl = this.response.body.podverseUrl,
          id = this.response.body.id;

      expect(podverseUrl).to.equal(`${config.baseUrl}/clips/${id}`);
    });

  });

  xit('should be able to get a clip', function () {

  });
});
