const appFactory = require('appFactory.js');

const PodcastService = require('services/podcast/PodcastService.js');
const {configureDatabaseModels} = require('test/helpers.js');


describe('API Test: Podcasts', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {
    this.app = appFactory({
      podcastService: new PodcastService({Models:this.Models})
    });

    // Throw a test in the database
    this.Models.Podcast.create({
      title: 'foobar',
      feedURL: 'http://example.com/rss'
      })
      .then(podcast => {
        this.testPodcast = podcast;
        done();
      });
  });

  it('should be able to retrieve the podcast in the database', function (done) {
    let id = this.testPodcast.id;

    chai.request(this.app)
      .get(`/podcasts/${id}`)
      .end(function (err, res) {
        const response = res.body;

        expect(response.title)
          .to.equal('foobar');
        expect(response.feedURL)
          .to.equal('http://example.com/rss');

        done();
      });


  });
});
