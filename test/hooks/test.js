
const errors = require('feathers-errors');
const {applyOwnerId, ensureAuthenticated} = require('hooks/common.js');

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


describe('Hook: ensureAuthenticated', function () {

  describe('when there is no userId param', function () {

    beforeEach(function () {

      this.testHookObj = {
        params: {}
      };


    });

    it('should throw the not authenticated error', function () {
      expect(()=>ensureAuthenticated(this.testHookObj))
        .to.throw(errors.NotAuthenticated)
    });
  });

  describe('when there is a userId param', function () {

  });



});
