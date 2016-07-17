const errors = require('feathers-errors');

const PlaylistService = require('services/playlists/PlaylistService.js');
const {configureDatabaseModels} = require('test/helpers.js');

const config = require('config');

describe('PlaylistService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  let testPlaylist, responseBody;

  beforeEach(function (done) {
    this.playlistSvc = new PlaylistService({Models: this.Models});
    let playlist = {
      slug: 'test-slug',
      title: 'Test Playlist',
      items: []
    }

    this.playlistSvc
      .create(playlist)
      .then(playlist => {
        this.playlist = playlist;
        done();
      })
  });

  it('should go', function () {
    expect(this.playlistSvc).to.be.ok;
  });

  describe('create playlist', function () {

    it('should create a playlist', function () {
      expect(this.playlist).to.exist;
    });

    xit('should not have a url saved to database', function() {
      // TODO: how can we test for this?
    });

  });

  describe('get playlist', function() {

    it('should be able to get a playlist by id', function (done) {
      this.playlistSvc.get(this.playlist.id, {})
      .then(playlist => {
        expect(playlist.title).to.equal('Test Playlist');
        done();
      });
    });

    it('should be able to get a playlist by slug', function (done) {
      this.playlistSvc.get(this.playlist.slug, {})
      .then(playlist => {
        expect(playlist.slug).to.equal('test-slug');
        done();
      });
    });

    it('should have a url property', function (done) {
      this.playlistSvc.get(this.playlist.slug, {})
        .then(playlist => {
        // TODO: can we make this more precise? expect the exact url?
        expect(playlist.url).to.exist;
        done();
      });
    });

  });

  describe('update playlist', function() {

    let updatedPlaylist = {
      slug: 'new-test-slug',
      title: 'New Test Playlist',
      items: []
    };

    it('should error if no id provided', function (done) {
      expect(() => this.playlistSvc.update(null, updatedPlaylist)).to.throw('Try using POST instead of PUT.');
      done();
    });

    it('should error if wrong id provided', function (done) {
      expect(() => this.playlistSvc.update('wrongId', updatedPlaylist)).to.throw(`Could not find a playlist by "wrongId"`);
      done();
    });

    it('should be able to update a playlist', function (done) {
      this.playlistSvc.update(this.playlist.id, updatedPlaylist);

      this.playlistSvc.get(this.playlist.id)
        .then(playlist => {
          expect(playlist.slug).to.equal('new-test-slug');
          expect(playlist.title).to.equal('New Test Playlist');
        });

      done();
    });
  });

  xit('should be able to remove a playlist', function () {

  });

  xit('should be able to paginate', function () {

  });
});
