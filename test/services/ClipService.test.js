const ClipService = require('services/clip/ClipService.js');
const {configureDatabaseModels, createTestPodcastAndEpisode} = require('test/helpers.js');

const {applyOwnerId} = require('hooks/common.js');

const config = require('config.js');

describe('ClipService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {

    const {MediaRef} = this.Models;

    this.clipSvc = new ClipService();

    createTestPodcastAndEpisode(this.Models)
      .then(([podcasts,episodes]) => {

        this.testPodcast = podcasts[0];
        this.testEpisode = episodes[0];

        return MediaRef.create({
          ownerId: 'testOwner',
          episodeId: this.testEpisode.id,
          title: 'TestTitle1',
          startTime: 5
        });
      })
      .then(mediaRefClip => {
        this.testMediaRef = mediaRefClip;

        return MediaRef.create({
          ownerId: 'testOwner',
          episodeId: this.testEpisode.id,
          title: 'TestTitle2',
          startTime: 0
        });
      })
      .then(mediaRefEpisode => {
        this.testMediaRefEpisode = mediaRefEpisode;
        done();
      })
      .catch(done);
  });

  it('should have the expected before-create hooks', function () {
    verifyBeforeCreateHooks(this.clipSvc, [
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

  describe('when finding clips', function () {

    beforeEach(function (done) {
      this.clipSvc.find()
        .then(clips => {
          this.resultClips = clips;
          done();
        });
    });

    it('should not return mediaRefs that are episodes', function () {
      expect(this.resultClips.length).to.equal(1);
    });

  });

  describe('when creating a clip', function () {

    beforeEach(function (done) {

      let testEpisode = Object.assign({}, this.testEpisode.dataValues, {podcast: this.testPodcast.dataValues});

      this.testData = {
        ownerId: 'foo',
        title: 'hamblam',
        startTime: 40,
        endTime: 50,
        episodeId: testEpisode.id,
        episode: testEpisode
      };

      this.clipSvc.create(this.testData)
        .then(result => {
          this.resolvedVal = result;
          done();
        })
        .catch(done);

    });

    it('should resolve the inserted clip', function () {
      expect(this.resolvedVal.ownerId).to.equal('foo');
      expect(this.resolvedVal.title).to.equal('hamblam');
    });

    it('should have inserted a MediaRef in the database', function (done) {
      this.Models.MediaRef.findAll({where: {title: this.testData.title}})
        .then(clip => {
          expect(clip[0].ownerId).to.equal('foo');
          expect(clip[0].title).to.equal('hamblam');
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
        .then(result => {
          done();
        })
        .catch(err => {
          expect(err).to.not.equal(null);
          done();
        });
    });

  });

  describe('when updating a clip as another user id', function () {

    it('should throw NotAuthenticated', function (done) {
      this.clipSvc.update(this.testMediaRef.id, {}, {userId: 'baad'})
        .then(done)
        .catch(err => {
          expect(err.name).to.equal('Forbidden');
          done();
        });
    });

  });

});
