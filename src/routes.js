const
    errors = require('feathers-errors'),
    {locator} = require('locator.js'),
    {parseFeed, saveParsedFeedToDatabase} = require('tasks/feedParser.js'),
    {isClipMediaRefWithDescription} = require('constants.js'),
    {verifyNonAnonUser} = require('middleware/auth/verifyNonAnonUser.js'),
    {isNonAnonUser} = require('util.js');

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
        req.params.podcastId = mediaRef.episode.podcastId;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {
          mediaRef.dataValues['isSubscribed'] = isSubscribed;
          res.render('player-page.html', mediaRef.dataValues);
        })
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
          req.params.podcastId = req.params.id;
          return new Promise((resolve, reject) => {
            isUserSubscribedToThisPodcast(resolve, reject, req);
          })
          .then((isSubscribed) => {
            podcast.dataValues['isSubscribed'] = isSubscribed;
            res.render('podcast-page.html', podcast.dataValues);
          });
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
        req.params.podcastId = episode.podcastId;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {
          episode.dataValues['isSubscribed'] = isSubscribed;
          res.render('player-page.html', episode.dataValues);
        })
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

  .post('/podcasts/subscribe/:id', verifyNonAnonUser, function (req, res) {
    const UserService = locator.get('UserService');
    UserService.update(req.feathers.userId, {}, {
      subscribeToPodcast: req.params.id
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        res.sendStatus(500);
        throw new errors.GeneralError(e);
      });
  })

  .post('/podcasts/unsubscribe/:id', verifyNonAnonUser, function (req, res) {
    const UserService = locator.get('UserService');
    UserService.update(req.feathers.userId, {}, {
      unsubscribeFromPodcast: req.params.id
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        res.sendStatus(500);
        throw new errors.GeneralError(e);
    });
  })

  .use('users', locator.get('UserService'))

  .get('/my-podcasts', (req, res) => {
    const UserService = locator.get('UserService');
    UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        res.render('my-podcasts-page.html', user);
      })
      .catch(e => {
        res.sendStatus(401);
      });
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

// TODO: where should this function go?
// I wanted to include this stuff as a hook, but I couldn't figure out how
// to use hooks when I use a custom route before the service,
// like the podcast detail page.
function isUserSubscribedToThisPodcast (resolve, reject, req) {
  if (isNonAnonUser(req.feathers.userId)) {
    const UserService = locator.get('UserService');
    return UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        let isUserSubscribed = user.podcasts.some(p => {
          return p.id === req.params.podcastId;
        });
        resolve(isUserSubscribed);
      })
      .catch(e => {
        reject(e);
      });
  } else {
    resolve(false)
  }
}

module.exports = {routes};
