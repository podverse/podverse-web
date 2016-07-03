'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('clip service', function() {
  it('registered the clips service', () => {
    assert.ok(app.service('clips'));
  });
});
