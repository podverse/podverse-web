const ClipService = require('services/clip/ClipService.js');
const {configureDatabaseModels, createTestUser} = require('test/helpers.js');

const {applyOwnerId} = require('hooks/common.js');

const config = require('config.js');

describe('ClipService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {

    const {MediaRef} = this.Models;

    this.clipSvc = new ClipService();

    createTestUser(this.Models)
      .then(user => {
        this.user = user;

        return this.clipSvc.create({
          title: 'TestTitle1',
          startTime: 3,
          endTime: 10,
          podcastTitle: 'testPodcastTitle234',
          podcastFeedURL: 'http://something.com/rss',
          episodeMediaURL: 'http://something.com/1.mp3',
          episodeTitle: 'testEpisodeTitle22'
        })
        .then(mediaRefClip => {
          this.testMediaRef = mediaRefClip;

          return this.clipSvc.create({
            title: 'TestTitle2',
            startTime: 0,
            podcastTitle: 'testPodcastTitle234',
            podcastFeedURL: 'http://something.com/rss',
            episodeMediaURL: 'http://something.com/1.mp3',
            episodeTitle: 'testEpisodeTitle22'
          })
        })
        .then(mediaRefEpisode => {
          this.testMediaRefEpisode = mediaRefEpisode;
          done();
        })
        .catch(done);
      })


  });

  // TODO
  xdescribe('when the user is logged in', () => {
    xit('adds the clip to the My Clips playlist', {

    });
  });

  // TODO
  xdescribe('when the user is not logged in', () => {
    xit('adds the clip to the My Clips playlist', {

    });
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

      this.testData = {
        ownerId: 'foo',
        title: 'hamblam',
        startTime: 40,
        endTime: 50,
        podcastTitle: 'testPodcastTitle234',
        podcastFeedURL: 'http://something.com/rss',
        episodeMediaURL: 'http://something.com/1.mp3',
        episodeTitle: 'testEpisodeTitle22'
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
        ownerId: 'testOwner',
        episodeId: 'someId',
        podcastFeedURL: 'http://some.rss.feed.com',
        episodeMediaURL: 'http://some.mediaURL.com'
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
