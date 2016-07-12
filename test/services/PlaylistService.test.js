
const PlaylistService = require('services/playlists/PlaylistService.js');
const {configureDatabaseModels} = require('test/helpers.js');

describe('PlaylistService', function () {

  configureDatabaseModels(function (Models) {
    this.Models = Models;
  });

  beforeEach(function () {
    this.playlistSvc = new PlaylistService({Models: this.models});
  });

  it('should go', function () {
    expect(this.playlistSvc).to.be.ok;
  });

  xit('should be able to get a playlist', function () {

  });

  xit('should be able to create a playlist', function () {

  });

  xit('should be able to update a playlist', function () {

  });

  xit('should be able to remove a playlist', function () {

  });

  xit('should be able to paginate', function () {

  });
});
