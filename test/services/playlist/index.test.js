'use strict';

const assert = require('assert');
const appFactory = require('src/appFactory.js');
const app = appFactory();

describe('playlist service index.js', function() {
  it('registered the playlists service in index.js', () => {
    assert.ok(app.service('playlists'));
  });
});
