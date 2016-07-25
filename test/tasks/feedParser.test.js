const feedParser = require('tasks/feedParser.js'),
      fs = require('fs'),
      appFactory = require('appFactory.js'),
      {configureDatabaseModels} = require('test/helpers.js');

describe('feedParser', function () {

  before(function () {
    this.app = appFactory();

    this.server = this.app.listen(1234);

    this.app
      .get('/localFeed', (req, res) => {
        fs.readFile(__dirname + '/../assets/rogan-example-rss.xml', 'utf8', function(err, data) {
          if (err) {
            return console.log(err);
          }
          res.status(200).send(data);
        })
      });
  });

  after(function () {
    this.server.close();
  });

  describe('parseFeed function', function () {

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

      describe('after a feed is successfully parsed and saveParsedFeedToDatabase is called', function () {

        configureDatabaseModels(function (Models) {
          this.Models = Models;
        })

        beforeEach(function (done) {
          feedParser.saveParsedFeedToDatabase(this.parsedFeedObj)
            .then(done);
        });

        xit('does something', function (done) {
          // it should expect something
          done();
        });

      });


    });

  });

});
