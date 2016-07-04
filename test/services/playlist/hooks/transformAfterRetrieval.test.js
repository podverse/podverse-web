'use strict';

const assert = require('assert');
const transformAfterRetrieval = require('../../../../src/services/playlist/hooks/transformAfterRetrieval.js');

describe('playlist transformAfterRetrieval hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    transformAfterRetrieval()(mockHook);

    assert.ok(mockHook.transformAfterRetrieval);
  });
});
