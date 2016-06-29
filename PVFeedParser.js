"use strict";

let FeedParser = require('feedparser'),
    request = require('request');

class PVFeedParser {

  parseFeed(rssURL) {

    return new Promise ((res, rej) => {

      // Uncomment below for local testing
      rssURL = 'http://localhost:9000/localFeed';

      let req = request(rssURL),
          feedparser = new FeedParser([]);

      // req.on('error', function (error) {
      //   // TODO: handle errors
      // });

      req.on('response', function (res) {
        let stream = this;

        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        stream.pipe(feedparser);
      });

      let episodeObjs = [],
          podcastObj = {},
          parsedFeedObj = {};

      feedparser.on('meta', function(meta) {
        podcastObj = meta;
      });

      feedparser.on('readable', function() {
        let stream = this,
            item;

        // TODO: this while assignment throws an eslint error. How can we fix it?
        while (item = stream.read()) {
          episodeObjs.push(item);
        }
      });

      feedparser.on('error', done);
      feedparser.on('end', done);

      function done(err) {
        if (err) { console.log(err); rej(err); }
        // else { console.log(jsonString) }
        else {
          parsedFeedObj.podcast = podcastObj;
          parsedFeedObj.episodes = episodeObjs;
          res(parsedFeedObj);
        }
      }

    });
  }

}

module.exports = PVFeedParser;
