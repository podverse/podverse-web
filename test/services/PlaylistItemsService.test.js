const {configureDatabaseModels, createTestPlaylist, createTestMediaRef} = require('test/helpers.js');
const appFactory = require('appFactory.js');

describe('PlaylistItemsService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {
    const {Playlist, MediaRef} = this.Models;

    return Promise.all([
      createTestPlaylist(this.Models),
      createTestMediaRef(this.Models)
    ])
      .then(([playlist, mediaRef]) => {
        this.playlistId = playlist.id;
        this.mediaRefId = mediaRef.id;
        this.app = appFactory();
        done();
      });
  });

  describe('add playlist item to playlist', function () {

    beforeEach(function (done) {
      chai.request(this.app)
        .post(`/playlists/addItem`)
        .send({
          'playlistId': this.playlistId,
          'mediaRefId': this.mediaRefId
        })
        .end((err, res) => {
          this.res = res;
          done();
        });
    });

    it('sends back a 200 code when successful', function () {
      expect(this.res.statusCode).to.equal(200);
    });

    xit('the playlist has the playlist item associated with it', function (done) {

    });

  });

  describe('remove playlist item from playlist', function () {

    beforeEach(function (done) {
      chai.request(this.app)
        .post(`/playlists/removeItem`)
        .send({
          'playlistId': this.playlistId,
          'mediaRefId': this.mediaRefId
        })
        .end((err, res) => {
          this.res = res;
          done();
        });
    });

    it('sends back a 200 code when successful', function () {
      expect(this.res.statusCode).to.equal(200);
    });

    xit('the playlist no longer has the playlist item associated with it')

  });

});
