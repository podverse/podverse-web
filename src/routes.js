const
    errors = require('feathers-errors'),
    {locator} = require('locator.js'),
    {parseFeed, saveParsedFeedToDatabase} = require('tasks/feedParser.js'),
    {isClipMediaRefWithDescription} = require('constants.js'),
    {verifyNonAnonUser} = require('middleware/auth/verifyNonAnonUser.js'),
    {isNonAnonUser} = require('util.js');

function routes () {
  const app = this,
        Models = locator.get('Models'),
        {Podcast, Episode, MediaRef} = Models,
        PodcastService = locator.get('PodcastService'),
        EpisodeService = locator.get('EpisodeService'),
        ClipService = locator.get('ClipService'),
        PlaylistService = locator.get('PlaylistService'),
        UserService = locator.get('UserService');

  app.get('/', function (req, res) {
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

  // Clip Detail Page
  .get('/clips/:id', (req, res) => {
    return ClipService.get(req.params.id)
      .then(mediaRef => {
        req.params.podcastId = mediaRef.episode.podcastId;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {
          mediaRef.dataValues['isSubscribed'] = isSubscribed;
          if (isNonAnonUser(req.feathers.userId)) {
            return PlaylistService.find(({query :{ ownerId: req.feathers.userId } }))
              .then(usersOwnedPlaylists => {
                mediaRef.dataValues['usersOwnedPlaylists'] = usersOwnedPlaylists;
                res.render('player-page.html', mediaRef.dataValues);
              })
          } else {
            mediaRef.dataValues['usersOwnedPlaylists'] = false;
            res.render('player-page.html', mediaRef.dataValues);
          }

        })
      }).catch(e => {
        res.sendStatus(404);
      });
  })

  .use('clips', locator.get('ClipService'))

  // Playlist Detail Page
  .get('/playlists/:id', (req, res) => {
    return PlaylistService.get(req.params.id)
      .then(playlist => {
        req.params.playlistId = playlist.id;
        // TODO: this is wildly bad and needs to be cleaned up.
        // Maybe the isSubscribed stuff should be handled in a hook somehow.
        let mediaRefs = playlist.dataValues.mediaRefs;
        let queue = Promise.resolve();
        mediaRefs.forEach((mediaRef) => {
          queue = queue.then(() => {
            return new Promise((resolve, reject) => {
              req.params.podcastId = mediaRef.episode.podcast.id;
              isUserSubscribedToThisPodcast(resolve, reject, req);
            })
              .then((isSubscribed) => {
                mediaRef.dataValues['isSubscribed'] = isSubscribed;
              })
          });
        });
        queue.then(() => {
          return new Promise((resolve, reject) => {
            isUserSubscribedToThisPlaylist(resolve, reject, req);
          })
            .then((isSubscribed) => {
              playlist.dataValues['isSubscribed'] = isSubscribed;

              if (playlist.dataValues['ownerId'] === req.feathers.userId) {
                playlist.dataValues['isOwner'] = true;
              }

              if (isNonAnonUser(req.feathers.userId)) {
                return PlaylistService.find(({query :{ ownerId: req.feathers.userId } }))
                  .then(usersOwnedPlaylists => {
                    playlist.dataValues['usersOwnedPlaylists'] = usersOwnedPlaylists;
                    res.render('player-page.html', playlist.dataValues);
                  })
              } else {
                playlist.dataValues['usersOwnedPlaylists'] = false;
                res.render('player-page.html', playlist.dataValues);
              }

            })
        })

      }).catch(e => {
        res.sendStatus(404);
      });
  })

  .use('playlists', locator.get('PlaylistService'))

  // Podcast Detail Page
  .get('/podcasts/:id', (req, res) => {
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
    return EpisodeService.get(req.params.id)
      .then(episode => {
        req.params.podcastId = episode.podcastId;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {
          episode.dataValues['isSubscribed'] = isSubscribed;

          if (isNonAnonUser(req.feathers.userId)) {
            return PlaylistService.find(({query :{ ownerId: req.feathers.userId } }))
              .then(usersOwnedPlaylists => {
                episode.dataValues['usersOwnedPlaylists'] = usersOwnedPlaylists;
                res.render('player-page.html', episode.dataValues);
              })
          } else {
            episode.dataValues['usersOwnedPlaylists'] = false;
            res.render('player-page.html', episode.dataValues);
          }

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
    UserService.update(req.feathers.userId, {}, {
      subscribeToPodcast: req.params.id,
      userId: req.feathers.userId
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
    UserService.update(req.feathers.userId, {}, {
      unsubscribeFromPodcast: req.params.id,
      userId: req.feathers.userId
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        res.sendStatus(500);
        throw new errors.GeneralError(e);
    });
  })

  .post('/playlists/subscribe/:id', verifyNonAnonUser, function (req, res) {
    UserService.update(req.feathers.userId, {}, {
      subscribeToPlaylist: req.params.id,
      userId: req.feathers.userId
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        res.sendStatus(500);
        throw new errors.GeneralError(e);
      });
  })

  .post('/playlists/unsubscribe/:id', verifyNonAnonUser, function (req, res) {
    UserService.update(req.feathers.userId, {}, {
      unsubscribeFromPlaylist: req.params.id,
      userId: req.feathers.userId
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        res.sendStatus(500);
        throw new errors.GeneralError(e);
    });
  })

  .post('/playlists/:playlistId/addItem/:mediaRefId', verifyNonAnonUser, function (req, res) {
    PlaylistService.get(req.params.playlistId)
      .then(playlist => {

        // NOTE: this if/else beast is here to convert episode's into mediaRefs so that the episode can be
        // added to a playlist as a mediaRef, AND to make sure that one episode only has one mediaRef
        // instance of itself. This approach stinks to high heaven, but it works for now.

        if (req.params.mediaRefId.indexOf('episode_') > -1) {
          let episodeId = req.params.mediaRefId.replace('episode_', '');

          EpisodeService.get(episodeId)
            .then(episode => {

              // Convert the episode into a mediaRef object
              let epMediaRef = {};
              epMediaRef.title = episode.title;
              epMediaRef.startTime = 0;
              epMediaRef.episodeId = episodeId;
              epMediaRef.ownerId = req.feathers.userId;

              // Find all mediaRefs with at least one episode where episode.feedURL === feedURL

              MediaRef.findOrCreate({
                where: {
                  startTime: 0,
                  $and: {
                    endTime: null
                  }
                },
                include: {
                  model: Episode,
                  where: {
                    mediaURL: episode.mediaURL
                  }
                },
                defaults: epMediaRef
              })
                .then(mediaRefArray => {
                  let mediaRef = mediaRefArray[0];
                  playlist.dataValues['playlistItems'] = [mediaRef.dataValues.id];
                  PlaylistService.update(req.params.playlistId, playlist.dataValues, { userId: req.feathers.userId })
                    .then(updatedPlaylist => {
                      res.send(200, updatedPlaylist);
                    })
                })
            })
        } else {
          playlist.dataValues['playlistItems'] = [req.params.mediaRefId];
          PlaylistService.update(req.params.playlistId, playlist.dataValues, { userId: req.feathers.userId })
            .then(updatedPlaylist => {
              res.send(200, updatedPlaylist);
            })
        }

      })
      .catch(e => {
        res.sendStatus(500);
        throw new errors.GeneralError(e);
      });
  })

  .use('users', locator.get('UserService'))

  .get('/my-podcasts', (req, res) => {
    UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        res.render('my-podcasts-page.html', user);
      })
      .catch(e => {
        res.sendStatus(401);
      });
  })

  .get('/my-playlists', (req, res) => {
    UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        user.dataValues['mySubscribedPlaylists'] = user.playlists;

        let recommendedToMe = user.playlists.filter(function (p) {
          return (p.ownerId !== req.feathers.userId && p.isRecommendation === true);
        });

        user.dataValues['recommendedForMe'] = recommendedToMe;

        return PlaylistService.find({ query: { ownerId: req.feathers.userId, isRecommendation: true }})
          .then(myRecommendations => {
            user.dataValues['recommendedByMe'] = myRecommendations;
            res.render('my-playlists-page.html', user.dataValues);
          })
      })
      .catch(e => {
        console.log(e);
        res.sendStatus(401);
      });
  })

  .get('/login-redirect', function (req, res) {
    res.render('login-redirect.html', req.query);
  })

  .get('/settings', function (req, res) {
    UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        res.render('settings.html', user.dataValues);
      })
      .catch(e => {
        console.log(e);
        res.sendStatus(401);
      });

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

function isUserSubscribedToThisPlaylist (resolve, reject, req) {
  if (isNonAnonUser(req.feathers.userId)) {
    const UserService = locator.get('UserService');
    return UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        let isUserSubscribed = user.playlists.some(p => {
          return p.id === req.params.playlistId;
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
