const
    errors = require('feathers-errors'),
    {locator} = require('locator.js'),
    {parseFeed, saveParsedFeedToDatabase} = require('tasks/feedParser.js'),
    {isClipMediaRefWithDescription} = require('constants.js');

function routes () {
  const app = this;

  app.get('/', function (req, res) {
    const ClipService = locator.get('ClipService');
    const Models = locator.get('Models');
    const {Episode, Podcast} = Models;

    let params = {};
    let pageIndex = req.query.page || 1;
    let offset = (pageIndex * 10) - 10;

    params.sequelize = {
      include: [{ model: Episode, include: [Podcast] }],
      where: isClipMediaRefWithDescription,
      offset: offset
    };

    params.paginate = {
      default: 10,
      max: 200
    };

    return ClipService.find(params)
      .then(page => {

        // TODO: handle 404 if beyond range of page object

        let total = page.total;
        let showNextButton = offset + 10 < total ? true : false;
        let clips = page.data;
        res.render('home.html', {
          clips: clips,
          pageIndex: pageIndex,
          showNextButton: showNextButton
        });
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
        res.render('player-page.html', playlist.dataValues);
      }).catch(e => {
        res.sendStatus(404);
      });
  })

  .use('playlists', locator.get('PlaylistService'))

  // Podcast Detail Page
  .get('/podcasts/:id', (req, res) => {
    const PodcastService = locator.get('PodcastService');
    return PodcastService.get(req.params.id)
      .then(podcast => {
        res.render('podcast-page.html', podcast.dataValues);
      }).catch(e => {
        res.sendStatus(404);
      });
  })

  .use('podcasts', locator.get('PodcastService'))

  // Episode Detail Page
  .get('/episodes/:id', (req, res) => {
    const EpisodeService = locator.get('EpisodeService');
    return EpisodeService.get(req.params.id)
      .then(episode => {
        res.render('player-page.html', episode.dataValues);
      }).catch(e => {
        res.sendStatus(404);
      });
  })

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

  .get('/login-redirect', function (req, res) {
    // TODO: is this login + redirection a security vulnerability?
    if (req.query.redirectTo) {
      res.redirect(decodeURIComponent(req.query.redirectTo));
    } else {
      res.redirect('/');
    }
  })

}

module.exports = {routes};
