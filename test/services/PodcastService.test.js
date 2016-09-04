const
    {configureDatabaseModels} = require('test/helpers.js'),
    PodcastService = require('services/podcast/PodcastService.js');

describe('PodcastService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {
    this.podcastSvc = new PodcastService();
  });

  it('should go', function () {
    expect(this.podcastSvc).to.be.ok;
  });

  it('should be able to get a podcast by ID', function (done) {

    this.Models.Podcast
      .create({feedURL: 'http://example.com/rss'})
      .then(podcast => {

        this.podcastSvc.get(podcast.id, {})
          .then(podcast => {
            expect(podcast).to.exist;
            done();
          });
      });

  });

  it('should be able to fuzzy match find a podcast by title', function (done) {

    this.Models.Podcast
      .create({
        feedURL: 'http://example.com/rss',
        title: 'Some kind of title'
      })
      .then(podcast => {
        this.podcastSvc.find({query: {title: 'kind of'}})
          .then(podcasts => {
            expect(podcasts[0].title).to.equal('Some kind of title');
            done();
          });
      });

  });

});
