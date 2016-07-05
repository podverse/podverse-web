'use strict';

const assert = require('assert');
const transformBeforeSave = require('../../../../src/services/playlist/hooks/transformBeforeSave.js');

describe('playlist transformBeforeSave hook', function() {
  let mockHook;

  beforeEach(function() {
    mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {
        _slug: 'test',
        url: 'https://podverse.fm/'
      }
    };
  });

  it('hook can be used', function() {
    let hook = transformBeforeSave()(mockHook);
    assert.ok(hook.transformBeforeSave);
  });

  it('hook adds slug if one is provided', function() {
    let hook = transformBeforeSave()(mockHook);
    assert.equal(hook.data._slug, 'test');
  });

  it('hook removes url if one is provided', function() {
    let hook = transformBeforeSave()(mockHook);
    assert.ok(!hook.data.url);
  });
});
