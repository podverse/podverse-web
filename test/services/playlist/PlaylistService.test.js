'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('PlaylistService class', () => {

  describe('get()', () => {
    let playlist;
    it('returns a playlist by id', () => {
      assert.ok(playlist);
    });

    it('returns a playlist by _slug', () => {
      assert.ok(playlist);
    });

  });

  it('registered the PlaylistService class', () => {
    assert.ok(app.service('playlists'));
  });
});
