const {configureDatabaseModels} = require('test/helpers.js');

xdescribe('PodcastService', function () {

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
            //expect(podcast.get({plain:true})).to.equal(3);
            done();
          });
      });

  });

  it('should be able to create a podcast by feedURL hash', function () {

  });

  it('should be able to update podcast by feed URL hash', function () {

  });

});
