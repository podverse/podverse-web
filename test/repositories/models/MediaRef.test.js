const {configureDatabaseModels, createTestPodcastAndEpisode} = require('test/helpers.js');

describe('MediaRefModel', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {
    createTestPodcastAndEpisode(this.Models)
      .then(([podcast, episode]) => {
        this.testPodacst = podcast;
        this.testEpisode = episode;
        done();
      });
  });

  it('should require an ownerId', function (done) {

    this.Models.MediaRef.create({
      episodeId: this.testEpisode.id
    })
    .then(done)
    .catch(e => {
      expect(e.name)
        .to.equal('SequelizeValidationError');
      done();
    });


  });

});
