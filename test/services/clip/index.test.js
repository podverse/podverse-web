'use strict';

const assert = require('assert');
const appFactory = require('src/appFactory.js');
const app = appFactory();

describe('clip service', function() {
  it('registered the clips service', () => {
    assert.ok(app.service('clips'));
  });
});
