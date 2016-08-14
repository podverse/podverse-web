
const
    errors = require('feathers-errors'),
    {addURL} = require('hooks/clip/clip.js');

describe('Hook: addURL', function () {

  beforeEach(function () {

    this.testHookObj = {
      result: {
        id: '1234',
        slug: 'sluggy-slug'
      }
    };

    addURL(this.testHookObj);
  });

  it('should apply the podverseURL to the response', function () {
    expect(this.testHookObj.result.podverseURL)
      .to.equal('http://localhost:8080/clips/sluggy-slug')
  });

});
