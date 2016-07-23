const appFactory = require('appFactory.js');

const {configureDatabaseModels, createTestPodcastAndEpisode} = require('test/helpers.js');

const {locator} = require('locator.js');
const
  PlaylistService = require('services/playlists/PlaylistService.js'),
  ClipService = require('services/clips/ClipService.js');

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

  it('should be able to create a clip by mediaURL/podcast', function (done) {

    chai.request(this.app)
      .post(`/clips`)
      .send({
        'title': 'jerry',
        'startTime':3,
        'endTime': 10,

        'episode': {

          mediaURL: 'http://something.com/1.mp3',

          'podcast': {
            feedURL: 'http://something.com/rss'
          }
        }
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(201);
        done();
      });

  });
});
