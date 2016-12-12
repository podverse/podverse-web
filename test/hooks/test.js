
const
    errors = require('feathers-errors'),
    {applyOwnerId} = require('hooks/common.js');

describe('Hook: applyOwnerId', function () {

  beforeEach(function () {

    this.testHookObj = {
      data: {},
      params: {userId: 'authenticatedUser'}
    };

    applyOwnerId(this.testHookObj);
  });

  it('should apply the userId to the ownerId', function () {
    expect(this.testHookObj.data.ownerId)
      .to.equal('authenticatedUser')
  });

});
