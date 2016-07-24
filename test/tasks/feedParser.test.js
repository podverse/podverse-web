const feedParser = require('tasks/feedParser.js');

describe('feedParser', function () {

  describe('when an invalid RSS URL is provided', function () {

    it('should throw an error', function (done) {
      feedParser.parseFeed('http://www.podverse.fm/fakepage')
        .catch(err => {
          console.log(err);
          expect(err).to.throw('Error: Bad status code');
          done();
        });
    });

  });

  describe('when a valid RSS URL is provided', function () {

    xit('should return a parsed feed object', function (done) {
      feedParser.parseFeed('http://joeroganexp.joerogan.libsynpro.com/rss')
        .then(parsedFeedObj => {
          console.log(parsedFeedObj.podcast.title);
          expect(parsedFeedObj).to.not.exist;
          done()
        })
        .catch(done);
    });

  });

});
