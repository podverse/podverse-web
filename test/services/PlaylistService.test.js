const errors = require('feathers-errors');

const PlaylistService = require('services/playlist/PlaylistService.js');
const {configureDatabaseModels, createTestPlaylist} = require('test/helpers.js');

const {applyOwnerId} = require('hooks/common.js');

const config = require('config');

describe('PlaylistService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function (done) {

    const {Playlist} = this.Models;

    this.playlistSvc = new PlaylistService({Models: this.Models});

    createTestPlaylist(this.Models)
      .then(playlist => {
        this.playlist = playlist;
        done();
      })
      .catch(done);

  });

  it('should go', function () {
    expect(this.playlistSvc).to.be.ok;
  });

  it('should have the expected before-create hooks', function() {
    verifyBeforeCreateHooks(this.playlistSvc, [
      applyOwnerId
    ]);
  });

  it('should have the expected before-update hooks', function () {
    verifyBeforeUpdateHooks(this.playlistSvc, [
      applyOwnerId
    ]);
  });

  it('should have remove disabled', function () {
    expect(this.playlistSvc.remove).to.be.not.ok;
  });

  it('should have patch disabled', function () {
    expect(this.playlistSvc.patch).to.be.not.ok;
  });

  describe('when getting a playlist by id', function() {

    beforeEach(function (done) {
      this.playlistSvc.get(this.playlist.id)
        .then(playlist => {
          this.resultPlaylist = playlist;
          done();
        });
    });

    it('should have the expected title', function () {
      expect(this.resultPlaylist.title).to.equal('Abobo smash');
    });

    it('should have a url', function () {
      expect(this.resultPlaylist.url).to.exist;
    });

  });

  describe('when getting a playlist by slug', function () {

    beforeEach(function (done) {
      this.playlistSvc.get(this.playlist.slug)
        .then(playlist => {
          this.resultPlaylist = playlist;
          done();
        });
    });

    it('should have the expected title', function () {
      expect(this.resultPlaylist.title).to.equal('Abobo smash');
    });

    it('should have a url', function () {
      expect(this.resultPlaylist.url).to.exist;
    });

    xit('should have its playlist items');

  });

  describe('when creating a playlist', function () {

    beforeEach(function (done) {

      this.testData = {
        ownerId: 'jabberwocky',
        title: 'Jubjub',
        slug: 'tumtum'
      };

      this.playlistSvc.create(this.testData)
        .then(result => {
          this.resolvedVal = result;
          done();
        })
        .catch(done);

    });

    it('should resolve the inserted playlist', function () {
      expect(this.resolvedVal).to.contain(this.testData);
    });

    it('should have inserted a playlist in the database', function (done) {
      this.Models.Playlist.findAll({where: {title: this.testData.title}})
        .then(playlist => {
          expect(playlist[0]).to.contain(this.testData);
          done();
        });
    });

    xit('should have its playlist items');

    xit('should not have a url saved to database');

    xit('should ensure slug has only valid characters');

  });

  describe('when updating a playlist as another user id', function() {

    it('should throw NotAuthenticated', function (done) {
      this.playlistSvc.update(this.playlist.id, {}, {ownerId: 'aboboy'})
        .then(done)
        .catch(err => {
          expect(err.name).to.equal('Forbidden');
          done();
        });
    });

  });

  describe('when updating a playlist as the correct user id', function () {

    beforeEach(function(done) {
      this.newPlaylist = {
        ownerId: 'abobo',
        title: 'Abobo smash again',
        slug: 'abobo-new-slug'
      };

      this.playlistSvc.update(this.playlist.id, this.newPlaylist);

      this.playlistSvc.get(this.playlist.id)
        .then(playlist => {
          this.updatedPlaylist = playlist;
          done();
        });
    });

    it('should have a new title', function () {
      expect(this.newPlaylist.title).to.equal('Abobo smash again');
    });

    it('should have a new slug', function () {
      expect(this.newPlaylist.slug).to.equal('abobo-new-slug');
    })

  });

});
