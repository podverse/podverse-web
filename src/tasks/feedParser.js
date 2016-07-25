const FeedParser = require('feedParser'),
      request = require('request');

function parseFeed (rssURL) {

  return new Promise ((res, rej) => {

    const feedParser = new FeedParser([]),
          req = request(rssURL);

    req.on('error', function (err) {
      rej(err);
    });

    req.on('response', function (res) {
      let stream = this;

      if (res.statusCode != 200) {
        return this.emit('error', new Error('Bad status code'));
      }

      stream.pipe(feedParser);
    });

    let jsonString = '',
        episodeObjs = [],
        podcastObj = {},
        parsedFeedObj = {};

    feedParser.on('meta', function (meta) {
      podcastObj = meta;
    });

    feedParser.on('readable', function () {
      let stream = this,
          item;

      while (item = stream.read()) {
        episodeObjs.push(item);
      }
    });

    feedParser.on('error', done);
    feedParser.on('end', done);

    function done (err) {
      if (err) {
        rej(err);
      }

      parsedFeedObj.podcast = podcastObj;
      parsedFeedObj.episodes = episodeObjs;
      res(parsedFeedObj);
    }

  });

}

module.exports = {
  parseFeed
}
