'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('playlist service', function() {
  it('registered the playlists service', () => {
    assert.ok(app.service('playlists'));
  });
});
