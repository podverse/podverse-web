'use strict';

const assert = require('assert');
const changeData = require('../../../../src/services/playlist/hooks/changeData.js');

describe('playlist changeData hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    changeData()(mockHook);

    assert.ok(mockHook.changeData);
  });
});
