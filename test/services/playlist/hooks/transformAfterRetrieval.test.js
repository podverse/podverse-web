'use strict';

const assert = require('assert');
const transformAfterRetrieval = require('../../../../src/services/playlist/hooks/transformAfterRetrieval.js');

describe('playlist transformAfterRetrieval hook', function() {

  const app = require('feathers')();

  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: app,
      params: {},
      result: {
        'title': 'hi i\'m a title'
      },
      data: {
        '_slug': 'slug-yo'
      }
    };

    transformAfterRetrieval()(mockHook);

    assert.ok(mockHook.transformAfterRetrieval);
  });
});
