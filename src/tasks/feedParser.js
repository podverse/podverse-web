const FeedParser = require('feedparser'),
      request = require('request'),
      {locator} = require('locator.js');

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

function saveParsedFeedToDatabase (parsedFeedObj) {
  const Models = locator.get('Models');

  const {Episode, Podcast} = Models;

  let podcast = parsedFeedObj.podcast;
  let episodes = parsedFeedObj.episodes;

  return Podcast.findOrCreate({
    where: {
      feedURL: podcast.xmlurl
    },
    defaults: Object.assign({}, podcast, {
      title: podcast.title,
      summary: podcast.description,
      imageURL: podcast.image.url, // node-feedparser supports image, itunes:image media:image, etc.,
      author: podcast.author,
      lastBuildDate: podcast.date,
      lastPubDate: podcast.pubdate
    })
  })

  .then(([podcast]) => {
    this.podcast = podcast;

    let arrayOfPromises = episodes.map(ep => Episode.findOrCreate({
        where: {
          mediaURL: ep.enclosures[0].url
        },
        // TODO: Do we want the podcast.id to be === to podcast feedURL?
        defaults: Object.assign({}, ep, {
          podcastId: podcast.id,
          title: ep.title,
          summary: ep.description,
          // duration: TODO: does node-feedparser give us access to itunes:duration?
          guid: ep.guid,
          link: ep.link,
          mediaBytes: ep.enclosures[0].length,
          mediaType: ep.enclosures[0].type,
          pubDate: ep.pubdate
        })
    }));

    // TODO: I am getting an error "cannot start a transaction within a transaction".
    // I read up on transactions, and I have an idea of how the Podcast.findOrCreate and
    // Episode.findOrCreate functions can be a part of a transaction, and why a transaction would
    // be a good thing here. However, I think this transaction error is actually with the
    // Promise.all(arrayOfPromises) call, and I am not sure how to fix it...

    Promise.all(arrayOfPromises)
      .catch(e => {
        console.log(e);
        return new errors.GeneralError(e);
      })
  })

}

module.exports = {
  parseFeed,
  saveParsedFeedToDatabase
}
