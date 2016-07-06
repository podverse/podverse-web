'use strict';

const assert = require('assert');

const appFactory = require('src/appFactory.js');

describe('PlaylistService', () => {

  before(function (done) {
    this.app = appFactory();
    this.sequelize = this.app.get('sequelize');

    // Gotta make sure the database is actually synchronized
    this.app.get('sequelize')
      .sync()
      .then(() => done())
  });

  describe('finding all playlists', () => {

    beforeEach(function () {

      let {Playlist} = this.app.get('sequelizeModels');
      this.playlistSvc = this.app.service('playlists');

      // Make a test playlist via model api
      Playlist.create({title: 'SomeTitle'});
    });

    afterEach(function (done) {
      let sequelize = this.app.get('sequelize');

      sequelize.drop()
        .then(() => sequelize.sync())
        .then(() => done());
    });

    it('should find the sole model', function (done) {

      this.playlistSvc.find()
        .then(playlists => {

          expect(playlists.total).to.equal(1);
          expect(playlists.data[0].title).to.equal('SomeTitle');

          done();
        })
        .catch(done);

    });

  });

  it('registered the PlaylistService class', function () {
    assert.ok(this.app.service('playlists'));
  });
});
