const errors = require('feathers-errors');

const ClipService = require('../../src/services/clip/ClipService.js');
const {configureDatabaseModels,
       createTestApp,
       createTestUser,
       createTestPodcastAndEpisodeAndFeedUrl} = require('../helpers.js');

const {applyOwnerId} = require('../../src/hooks/common.js');

describe('ClipService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {

    const {MediaRef} = this.Models;

    this.clipSvc = new ClipService();

    createTestApp();

    createTestPodcastAndEpisodeAndFeedUrl()
      .then(arr => {
        // podcast and episode must exist for EpisodeService.validateMediaUrl
        let podcast = arr[0],
            episode = arr[1];

        createTestUser(this.Models)
          .then(user => {
            this.user = user;

            return this.clipSvc.create({
              title: 'TestTitle1',
              startTime: 3,
              endTime: 10,
              podcastTitle: 'testPodcastTitle234',
              podcastFeedUrl: 'http://something.com/rss',
              episodeMediaUrl: 'http://something.com/1.mp3',
              episodeTitle: 'testEpisodeTitle22'
            })
            .then(mediaRefClip => {
              this.testMediaRef = mediaRefClip;

              return this.clipSvc.create({
                title: 'TestTitle2',
                startTime: 0,
                podcastTitle: 'testPodcastTitle234',
                podcastFeedUrl: 'http://something.com/rss',
                episodeMediaUrl: 'http://something.com/1.mp3',
                episodeTitle: 'testEpisodeTitle22'
              })
              .then(mediaRefEpisode => {
                this.testMediaRefEpisode = mediaRefEpisode;
                done();
              })
            })
            .catch(done);
          })
      })
      .catch(e => {
        console.log(e);
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

  describe('when finding all playlists', function () {

    describe('when no parameters are provided', function () {

      it('should reject with an error', function () {
        expect(this.clipSvc.find).to.throw(errors.GeneralError);
      });

    });

    describe('when parameters are provided', function () {

      beforeEach(function (done) {
        this.clipSvc.find({sequelize : {}})
          .then(clips => {
            this.foundClips = clips;
            done();
          });
      });

      it('should return clips', function () {
        expect(this.foundClips.length).to.equal(2);
      });

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
        podcastFeedUrl: 'http://something.com/rss',
        episodeMediaUrl: 'http://something.com/1.mp3',
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
