'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('playlist service index.js', function() {
  it('registered the playlists service in index.js', () => {
    assert.ok(app.service('playlists'));
  });
});
