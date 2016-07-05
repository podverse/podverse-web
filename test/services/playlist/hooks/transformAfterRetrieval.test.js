'use strict';

const assert = require('assert');
const transformAfterRetrieval = require('../../../../src/services/playlist/hooks/transformAfterRetrieval.js');

describe('playlist transformAfterRetrieval hook', function() {
  const app = require('../../../../src/app');
  let mockHook;

  beforeEach(function() {
    mockHook = {
      type: 'after',
      app: app,
      params: {},
      result: {
        _slug: 'test',
      },
      data: {}
    };
  });

  it('hook can be used', function() {
    let hook = transformAfterRetrieval()(mockHook);
    assert.ok(hook.transformAfterRetrieval);
  });

  it('hook adds the proper url', function() {
    let hook = transformAfterRetrieval()(mockHook);
    assert.equal(hook.result.url, `${app.get('baseURL')}/playlists/test`);
  });
});
