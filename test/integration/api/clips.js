const {locator} = require('locator.js');

const appFactory = require('appFactory.js');
const {configureDatabaseModels, createTestPodcastAndEpisode, createValidTestJWT} = require('test/helpers.js');

const ClipService = require('services/clip/ClipService.js');

const config = require('config.js');

describe('API Test: Clips', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {

    createTestPodcastAndEpisode(this.Models)
      .then(([podcast, episode]) => {
        this.testPodcast = podcast;
        this.testEpisode = episode;
        done();
      });

  });

  beforeEach(function () {

    locator.set('PlaylistService', new ClipService());
    locator.set('ClipService', new ClipService());

    this.app = appFactory();
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

          'episode': {
            title: 'testEpisodeTitle22',
            mediaURL: 'http://something.com/1.mp3',
            'podcast': {
              title: 'testPodcastTitle234',
              feedURL: 'http://something.com/rss'
            }
          }
        })
        .end((err, res) => {
          this.response = res;
          done();
        });
    });

    it('should return 201', function () {
      expect(this.response.statusCode).to.equal(201);
    });

    it('should return the url', function () {
      let url = this.response.body.url,
          id = this.response.body.id;
          
      expect(url).to.equal(`${config.baseURL}/clips/${id}`);
    });

    it('should have saved the podcast object with the title', function (done) {

      // Expect there to be an episode created with the title.
      this.Models.Podcast.findOne({
        where: {
          title: 'testPodcastTitle234'
        }
      })
      .then(podcast => {
        expect(podcast).to.not.equal(null);
        expect(podcast.feedURL).to.equal('http://something.com/rss');
        done();
      })
      .catch(done);

    });

    it('should have saved the episode object', function (done) {
            // Expect there to be an episode created with the title.
            this.Models.Episode.findOne({
              where: {
                title: 'testEpisodeTitle22'
              }
            })
            .then(episode => {
              expect(episode).to.not.equal(null);
              expect(episode.mediaURL).to.equal('http://something.com/1.mp3');
              done();
            })
            .catch(done);
    });

  });

  xit('should be able to get a clip', function () {

  });
});
