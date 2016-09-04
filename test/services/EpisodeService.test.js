const
    {configureDatabaseModels, createTestPodcastAndEpisode} = require('test/helpers.js'),
    EpisodeService = require('services/episode/EpisodeService.js');

describe('EpisodeService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {
    this.episodeSvc = new EpisodeService();

    createTestPodcastAndEpisode(this.Models)
      .then(([podcasts, episodes]) => {
        this.episode = episodes[0];
        done();
      });
  });

  it('should go', function () {
    expect(this.episodeSvc).to.be.ok;
  });

  it('should be able to get an episode by ID', function (done) {

    this.episodeSvc.get(this.episode.id, {})
      .then(episode => {
        expect(episode).to.exist;
        done();
      });

  });

});
