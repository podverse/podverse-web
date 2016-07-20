const ClipService = require('services/clips/ClipService.js');
const {configureDatabaseModels, createTestPodcastAndEpisode} = require('test/helpers.js');

const {applyOwnerId, ensureAuthenticated} = require('hooks/common.js');

describe('ClipService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {

    const {MediaRef} = this.Models;

    this.clipSvc = new ClipService({Models: this.Models});

    createTestPodcastAndEpisode(this.Models)
      .then(([podcast,episode]) => {

        this.testPodcast = podcast;
        this.testEpisode = episode;

        return MediaRef.create({
          ownerId: 'testOwner',
          episodeId: episode.id,
          title: 'TestTitle1'
        });
      })
      .then(clip => {
        this.testMediaRef = clip;
        done();
      })
      .catch(done);
  });

  it('should have the expected before-create hooks', function () {
    verifyBeforeCreateHooks(this.clipSvc, [
      ensureAuthenticated,
      applyOwnerId
    ]);
  });

  it('should have the expected before-update hooks', function () {
    verifyBeforeUpdateHooks(this.clipSvc, [
      ensureAuthenticated,
      applyOwnerId
    ]);
  });

  it('should have remove disabled', function () {
    expect(this.clipSvc.remove).to.be.not.ok;
  });

  it('should have patch disabled', function () {
    expect(this.clipSvc.patch).to.be.not.ok;
  });

  describe('when getting clip by id', function () {

    beforeEach(function (done) {
      this.clipSvc.get(this.testMediaRef.id)
        .then(clip => {
          this.resultClip = clip;
          done();
        });
    });

    it('should have the expected title', function () {
      expect(this.resultClip.title).to.equal('TestTitle1');
    });

    it('should have the episode included', function () {
      expect(this.resultClip.episode.id).to.equal(this.testEpisode.id);
    });

    it('should have the podcast included', function () {
      expect(this.resultClip.episode.podcast.id).to.equal(this.testPodcast.id);
    });

  });

  describe('when creating a clip', function () {

    beforeEach(function (done) {

      this.testData = {
        ownerId: 'foo',
        title: 'hamblam',
        startTime: 40,
        endTime: 50,
        episodeId: this.testEpisode.id
      };

      this.clipSvc.create(this.testData)
        .then(result => {
          this.resolvedVal = result;
          done();
        })
        .catch(done);

    });

    it('should resolve the inserted clip', function () {
      expect(this.resolvedVal).to.contain(this.testData);
    });

    it('should have inserted a MediaRef in the database', function (done) {
      this.Models.MediaRef.findAll({where: {title: this.testData.title}})
        .then(clip => {
          expect(clip[0]).to.contain(this.testData);
          done();
        });
    });
  });

  describe('when creating a clip with no episode', function () {

    it('should reject with an error', function (done) {

      const data = {
        title: 'fooo'
      };

      this.clipSvc.create(data, {ownerId: 'notnull'})
        .then(done)
        .catch(err => {
          expect(err).to.not.equal(null);
          done();
        });
    });

  });

  describe('when updating a clip as another user id', function () {

    it('should throw NotAuthenticated', function (done) {
      this.clipSvc.update(this.testMediaRef.id, {}, {ownerId: 'baad'})
        .then(done)
        .catch(err => {
          expect(err.name).to.equal('Forbidden');
          done();
        });
    });

  });

});
