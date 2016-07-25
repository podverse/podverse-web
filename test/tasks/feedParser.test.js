const feedParser = require('tasks/feedParser.js'),
      fs = require('fs'),
      appFactory = require('appFactory.js');

describe('feedParser', function () {

  describe('parseFeed function', function () {

    before(function () {
      this.app = appFactory();

      this.server = this.app.listen(1234);

      this.app
        .get('/localFeed', (req, res) => {
          fs.readFile(__dirname + '/../assets/rogan-example-rss.xml', 'utf8', function(err, data) {
            if (err) {
              return console.log(err);
            }
            res.send(200, data);
          })
        });
    });

    after(function () {
      this.server.close();
    });

    describe('when an invalid RSS URL is provided', function () {

      beforeEach(function (done) {
        feedParser.parseFeed('http://www.podverse.fm/fakepage')
          .then(done)
          .catch(err => {
            this.err = err;
            done();
          });
      });

      it('should reject with bad status code', function () {
        expect(this.err.message).to.equal('Bad status code');
      });

    });

    describe('when a valid RSS URL is provided', function () {

      beforeEach(function (done) {
        feedParser.parseFeed('http://localhost:1234/localFeed')
          .then(parsedFeedObj => {
            this.parsedFeedObj = parsedFeedObj;
            done();
          });
      });

      it('should return a parsed feed object', function () {
        expect(this.parsedFeedObj).to.exist;
      });

      it('parsed feed object should have a podcast title', function () {
        expect(this.parsedFeedObj.podcast.title).to.equal('The Joe Rogan Experience');
      });

    });

  });

});
