const
    FeedParser = require('feedparser'),
    request = require('request'),
    {locator} = require('locator.js'),
    errors = require('feathers-errors');

// If the podcast's lastBuildDate stored in the db is older than the lastBuildDate
// in the feed, then parse the full feed.
function parseFullFeedIfFeedHasBeenUpdated (resolve, reject, feedURL) {
  let Models = locator.get('Models');
  let {Podcast} = Models;

  return Podcast.findOne({
    where: {
      feedURL: feedURL
    },
    attributes: ['lastBuildDate']
  })
  .then(podcast => {

    parseFeed(feedURL, false)
      .then(parsedFeedObj => {

        if (!podcast || !podcast.lastBuildDate || parsedFeedObj.date > podcast.lastBuildDate) {
          parseFeed(feedURL, true)
            .then(fullParsedFeedObj => {
              resolve(fullParsedFeedObj);
            })
        } else {
          resolve(parsedFeedObj);
        }

      })

  })
}

function parseFeed (feedURL, shouldParseEpisodes) {

  return new Promise ((res, rej) => {

    const feedParser = new FeedParser([]),
          req = request(feedURL);

    req.on('error', function (e) {
      console.log(e);
      rej(e);
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

      if (!shouldParseEpisodes) {
        done();
      }

    });

    if (shouldParseEpisodes) {
      feedParser.on('readable', function () {
        let stream = this,
            item;

        while (item = stream.read()) {
          episodeObjs.push(item);
        }
      });
    }

    feedParser.on('error', done);
    feedParser.on('end', done);

    function done (e) {
      if (e) {
        console.log(e);
        rej(e);
      }

      if (!podcastObj.xmlurl) {
        podcastObj.xmlurl = feedURL;
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

  // Reduce the episodes array to 5000 items, in case someone maliciously tries
  // to overload the database
  episodes = episodes.slice(0, 5000);

  // Check if the feed looks like a Podcast RSS feed.
  // If no audio items are found in the expected enclosures url field,
  // then the feed might be a blog, and we should cancel parsing.
  let hasValidEpisode = false;

  for (var episode of episodes) {
    if (episode.enclosures && episode.enclosures[0] && episode.enclosures[0].url) {
      let url = episode.enclosures[0].url;

      if (url.indexOf('.mp3') > -1 || url.indexOf('.ogg') > -1 || url.indexOf('.m4a') > -1 || url.indexOf('.mp4') > -1) {
        hasValidEpisode = true;
        break;
      }
    }
  }

  if (hasValidEpisode === false) {
    throw new errors.GeneralError('No episodes were found in this RSS feed.');
  }

  return Podcast.findOrCreate({
    where: {
      feedURL: podcast.xmlurl
    },
    defaults: Object.assign({}, podcast, {
      imageURL: podcast.image.url, // node-feedparser supports image, itunes:image media:image, etc.,
      summary: podcast.description,
      title: podcast.title,
      author: podcast.author,
      lastBuildDate: podcast.date,
      lastPubDate: podcast.pubdate
    })
  })

  .then(([podcast]) => {
    this.podcast = podcast;

    return promiseChain = episodes.reduce((promise, ep) => {

      if (!ep.enclosures || !ep.enclosures[0] || !ep.enclosures[0].url) {
        return promise
      }

      return promise.then(() => Episode.findOrCreate({
          where: {
            mediaURL: ep.enclosures[0].url
          },
          // TODO: Do we want the podcast.id to be === to podcast feedURL?
          defaults: Object.assign({}, pruneEpisode(ep), {
            podcastId: podcast.id
          })
      })
      .catch(e => {
        console.log(e);
        throw new errors.GeneralError(e);
      }));
    }, Promise.resolve());

  })
  .then(() => {
    return this.podcast.id;
  })
  .catch((e) => {
    console.log(e);
    throw new errors.GeneralError(e);
  });

}

function pruneEpisode(ep) {
  let prunedEpisode = {};

  if (ep.image && ep.image.url) { prunedEpisode.imageURL = ep.image.url }
  if (ep.title) { prunedEpisode.title = ep.title }
  if (ep.description) { prunedEpisode.summary = ep.description }
  if (ep.duration) { prunedEpisode.duration } // TODO: does node-feedparser give us access to itunes:duration?
  if (ep.guid) { prunedEpisode.guid = ep.guid }
  if (ep.link) { prunedEpisode.link = ep.link }
  if (ep.enclosures && ep.enclosures[0]) {
    if (ep.enclosures[0].length) { prunedEpisode.mediaBytes = ep.enclosures[0].length }
    if (ep.enclosures[0].type) { prunedEpisode.mediaType = ep.enclosures[0].type }
  }
  if (ep.pubDate) { prunedEpisode.pubDate = ep.pubdate }

  return prunedEpisode
}

module.exports = {
  parseFeed,
  parseFullFeedIfFeedHasBeenUpdated,
  saveParsedFeedToDatabase
}
