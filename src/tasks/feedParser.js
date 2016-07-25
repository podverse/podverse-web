const FeedParser = require('feedParser'),
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

    // TODO: we have to use Promise.all here (I think) to be able to loop through the
    // db findOrCreate promises. I've never used Promise.all haven't been able to
    // get it to work here. Temporarily I'm just returning one episode instead of
    // the full array of episodes until I understand Promise.all here...

    return Episode.findOrCreate({
      where: {
        mediaURL: episodes[0].enclosures[0].url
      },
      // TODO: Do we want the podcast.id to be === to podcast feedURL?
      defaults: Object.assign({}, episodes[0], {
        podcastId: podcast.id,
        title: episodes[0].title,
        summary: episodes[0].description,
        // duration: TODO: does node-feedparser give us access to itunes:duration?
        guid: episodes[0].guid,
        link: episodes[0].link,
        mediaBytes: episodes[0].enclosures[0].length,
        mediaType: episodes[0].enclosures[0].type,
        pubDate: episodes[0].pubdate
      })
    });

  })

  .then(([episodes]) => {
    console.log(this.podcast.title);
    console.log(episodes.dataValues);

    // TODO: what do we want to return here? saveParsedFeedToDatabase doesn't
    // need to return something, it just needs to update the database...

  });

}

module.exports = {
  parseFeed,
  saveParsedFeedToDatabase
}
