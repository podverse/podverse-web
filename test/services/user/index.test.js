'use strict';

const assert = require('assert');
const appFactory = require('src/appFactory.js');
const app = appFactory();

describe('user service', function() {

  it('registered the users service', () => {
    assert.ok(app.service('users'));
  });

});
