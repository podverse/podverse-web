const PodcastService = require('services/podcast/PodcastService.js');
const {configureDatabaseModels} = require('test/helpers.js');

describe('PodcastService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {
    this.podcastSvc = new PodcastService({Models: this.Models});
  });

  it('should go', function () {
    expect(this.podcastSvc).to.be.ok;
  });

  it('should be able to get a podcast', function (done) {

    this.Models.Podcast
      .create({feedURL: 'http://example.com/rss'})
      .then(podcast => {

        this.podcastSvc.get(podcast.id, {})
        .then(podcast => {
          //expect(podcast.get({plain:true})).to.equal(3);
          done();
        });
      });


  });

  xit('should be able to create a podcast', function () {

  });

  xit('should be able to update a podcast', function () {

  });

  xit('should be able to remove a podcast', function () {

  });

  xit('should be able to paginate', function () {

  });
});
