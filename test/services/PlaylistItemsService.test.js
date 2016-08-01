const {configureDatabaseModels, createTestPlaylist, createTestMediaRefs} = require('test/helpers.js');
const appFactory = require('appFactory.js');

describe('PlaylistItemsService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {

    return Promise.all([
      createTestPlaylist(this.Models),
      createTestMediaRefs(this.Models)
    ])
      .then(([playlist, mediaRef]) => {
        this.playlist = playlist;
        this.mediaRef = mediaRef;
        this.app = appFactory();
        done();
      });
  });

  describe('add playlist item to playlist', function () {

    beforeEach(function (done) {
      chai.request(this.app)
        .post(`/playlists/addItem`)
        .send({
          'playlistId': this.playlist.id,
          'mediaRefId': this.mediaRef.id
        })
        .end((err, res) => {
          this.res = res;
          done();
        });
    });

    xit('sends back a 200 code when successful', function () {
      expect(this.res.statusCode).to.equal(200);
    });

    xit('the playlist has the playlist item associated with it', function (done) {
      this.playlist.getMediaRefs().then(function(mediaRefs) {
        expect(mediaRefs.length).to.equal(1);
        done();
      });
    });

    describe('then remove the playlist item from the playlist', function () {

      beforeEach(function (done) {
        chai.request(this.app)
          .post(`/playlists/removeItem`)
          .send({
            'playlistId': this.playlist.id,
            'mediaRefId': this.mediaRef.id
          })
          .end((err, res) => {
            this.res = res;
            done();
          });
      });

      xit('sends back a 200 code when successful', function () {
        expect(this.res.statusCode).to.equal(200);
      });

      xit('the playlist no longer has the playlist item associated with it', function (done) {
        this.playlist.getMediaRefs().then(function(mediaRefs) {
          expect(mediaRefs.length).to.equal(0);
          done();
        });
      });

    });

  });

});
