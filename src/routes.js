const
    errors = require('feathers-errors'),
    {locator} = require('locator.js'),
    {parseFeed, saveParsedFeedToDatabase} = require('tasks/feedParser.js'),
    {isClipMediaRef} = require('constants.js');

function routes () {
  const app = this;

  app.get('/', function (req, res) {
    const ClipService = locator.get('ClipService');
    const Models = locator.get('Models');
    const {Episode, Podcast} = Models;

    let params = {};
    params.sequelize = {
        limit: 20,
        include: [
          { model: Episode, include: [Podcast] }
        ],
        where: isClipMediaRef
    };

    return ClipService.find(params)
      .then(clips => {
        res.render('home.html', {clips: clips});
      })
      .catch(e => {
        console.log(e);
      });
  })

  .get('/make-clip', function (req, res) {
    res.render('make-clip.html');
  })

  // Clip Detail Page
  .get('/clips/:id', (req, res) => {
    const ClipService = locator.get('ClipService');
    return ClipService.get(req.params.id)
      .then(mediaRef => {
        res.render('player-page.html', mediaRef.dataValues);
      }).catch(e => {
        res.sendStatus(404);
      });
  })

  .use('clips', locator.get('ClipService'))

  // Playlist Detail Page
  .get('/playlists/:id', (req, res) => {
    const PlaylistService = locator.get('PlaylistService');
    return PlaylistService.get(req.params.id)
      .then(playlist => {
        res.render('player.html', playlist.dataValues);
      }).catch(e => {
        res.sendStatus(404);
      });
  })

  .use('playlists', locator.get('PlaylistService'))

  .use('podcasts', locator.get('PodcastService'))

  .use('episodes', locator.get('EpisodeService'))

  .post('/parse', (req, res) => {
    if (req.body.feedURL) {
      parseFeed(req.body.feedURL)
        .then(parsedFeedObj => {
          return saveParsedFeedToDatabase(parsedFeedObj);
        })
        .then(podcastId => {
          const PodcastService = locator.get('PodcastService');
          return PodcastService.get(podcastId)
        })
        .then(podcast => {
          res.send(podcast);
        })
        .catch(e => {
          // TODO: I reallly need to learn how to handle errors. I have no idea.
          res.sendStatus(500);
          throw new errors.GeneralError(e);
        });
    } else {
      // TODO: how should we throw an error here? Do we need to use the errorHandler somehow?
      throw new errors.GeneralError('A valid RSS feed URL must be provided.');
    }
  })

}

module.exports = {routes};
