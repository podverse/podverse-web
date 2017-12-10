
const
    errors = require('feathers-errors'),
    {addUrl} = require('hooks/clip/clip.js');

describe('Hook: addUrl', function () {

  beforeEach(function () {

    this.testHookObj = {
      result: {
        id: '1234',
        slug: 'sluggy-slug'
      }
    };

    addUrl(this.testHookObj);
  });

  it('should apply the podverseUrl to the response', function () {
    // TODO: this needs to conditionally handle production and development
    expect(this.testHookObj.result.podverseUrl)
      .to.equal('http://localhost:8080/clips/sluggy-slug')
  });

});
