'use strict';

const assert = require('assert');
const transformBeforeSave = require('../../../../src/services/playlist/hooks/transformBeforeSave.js');

describe('playlist transformBeforeSave hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    transformBeforeSave()(mockHook);

    assert.ok(mockHook.transformBeforeSave);
  });
});
