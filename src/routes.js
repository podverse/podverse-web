const
    errors = require('feathers-errors'),
    {locator} = require('locator.js'),
    {isClipMediaRefWithTitle} = require('constants.js'),
    {getLoggedInUserInfo} = require('middleware/auth/getLoggedInUserInfo.js'),
    {queryGoogleApiData} = require('services/googleapi/googleapi.js'),
    {isNonAnonUser} = require('util.js');

function routes () {
  const app = this,
        Models = locator.get('Models'),
        {MediaRef} = Models,
        PodcastService = locator.get('PodcastService'),
        EpisodeService = locator.get('EpisodeService'),
        ClipService = locator.get('ClipService'),
        PlaylistService = locator.get('PlaylistService'),
        UserService = locator.get('UserService');

  app.get('/', getLoggedInUserInfo, function (req, res) {

    let pageIndex = req.query.page || 1;
    let offset = (pageIndex * 10) - 10;
    let params = {};

    let queryObj = {
      metrics: 'ga:uniquePageviews',
      dimensions: 'ga:pagePath',
      startDate: '14daysAgo',
      endDate: 'today',
      sort: '-ga:uniquePageviews',
      // maxResults: only 10 will load on a page, but we don't want
      // clips without titles to appear in the list
      maxResults: 30,
      startIndex: offset || 1,
      filters: 'ga:pagePath=~/clips'
    }

    // NOTE: If no clips were returned by Google API, then in the catch statement
    // populate the home page with all the most recent clips created that have a title
    return new Promise((resolve, reject) => {
      queryGoogleApiData(resolve, reject, queryObj)
    })
    .then(data => {
      // Extract clip ids from data to pass into db query
      let clipIdArray = [];
      data.forEach((clipItem) => {
        let urlPath = clipItem[0];
        let clipId = urlPath.replace('/clips/', '');
        clipIdArray.push(clipId);
      });

      params.sequelize = {
        where: {
          id: clipIdArray,
          $and: isClipMediaRefWithTitle
        },
        limit: 10
      };

      return ClipService.find(params)
        .then(clips => {
          // TODO: handle 404 if beyond range of page object
          res.render('home/index.html', {
            clips: clips,
            pageIndex: pageIndex,
            showNextButton: true,
            currentPage: 'Home Page'
          });
        })
        .catch(e => {
          console.log(e);
        });
    })
    .catch(err => {
      params.sequelize = {
        where: isClipMediaRefWithTitle,
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

          // TODO: handle 404 if beyond range of page object
          res.render('home/index.html', {
            clips: clips,
            pageIndex: pageIndex,
            showNextButton: showNextButton,
            currentPage: 'Home Page',
            locals: res.locals
          });
        })
        .catch(e => {
          console.log(e);
        });
    });
  })

  // Clip Detail Page
  .get('/clips/:id', getLoggedInUserInfo, (req, res) => {
    return ClipService.get(req.params.id)
      .then((mediaRef) => {
        req.params.podcastFeedURL = mediaRef.podcastFeedURL;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
          .then((isSubscribed) => {
            mediaRef.dataValues['isSubscribed'] = isSubscribed;
            return new Promise((resolve, reject) => {
              gatherUsersOwnedPlaylists(resolve, reject, req);
            })
              .then((usersOwnedPlaylists) => {
                mediaRef.dataValues['usersOwnedPlaylists'] = usersOwnedPlaylists;
                mediaRef.dataValues['currentPage'] = 'Clip Detail Page';
                mediaRef.dataValues['locals'] = res.locals;
                res.render('player-page/index.html', mediaRef.dataValues);
              })
        })
      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  .use('clips', locator.get('ClipService'))

  // Playlist Detail Page
  .get('/playlists/:id', getLoggedInUserInfo, (req, res) => {
    return PlaylistService.get(req.params.id)
      .then(playlist => {
        req.params.playlistId = playlist.id;
        let mediaRefs = playlist.dataValues.mediaRefs;
        return new Promise((resolve, reject) => {
          getUsersSubscribedPodcastFeedURLs(resolve, reject, req);
        })
          .then((subscribedPodcastFeedURLs) => {
            subscribedPodcastFeedURLs = subscribedPodcastFeedURLs || [];
            mediaRefs.forEach(mediaRef => {
              if (subscribedPodcastFeedURLs.includes(mediaRef.podcastFeedURL)) {
                mediaRef.dataValues['isSubscribed'] = true;
              }
            });
            return new Promise((resolve, reject) => {
              isUserSubscribedToThisPlaylist(resolve, reject, req);
            })
              .then((isSubscribed) => {
                playlist.dataValues['isSubscribed'] = isSubscribed;

                if (playlist.dataValues['ownerId'] === req.feathers.userId) {
                  playlist.dataValues['isOwner'] = true;
                }

                return new Promise((resolve, reject) => {
                  gatherUsersOwnedPlaylists(resolve, reject, req);
                })
                  .then((usersOwnedPlaylists) => {
                    playlist.dataValues['usersOwnedPlaylists'] = usersOwnedPlaylists;
                    playlist.dataValues['currentPage'] = 'Playlist Detail Page';
                    playlist.dataValues['locals'] = res.locals;
                    res.render('player-page/index.html', playlist.dataValues);
                  });
              });
          })

      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  .use('playlists', locator.get('PlaylistService'))

  // Alias URL for the Podcast Detail Page based on podcastFeedURL
  .get('/podcasts/alias', (req, res) => {
    return PodcastService.get('alias', {feedURL: req.query.feedURL})
      .then(podcast => {
        res.redirect('/podcasts/' + podcast.dataValues.id);
      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  .get('/podcasts/isSubscribed', getLoggedInUserInfo, (req, res) => {
    req.params.podcastFeedURL = req.query.podcastFeedURL;

    return new Promise((resolve, reject) => {
      isUserSubscribedToThisPodcast(resolve, reject, req);
    })
    .then(isSubscribed => {
      res.send(isSubscribed);
    })
    .catch(e => {
      console.log(e);
      res.send(false);
    })
  })

  // Podcast Detail Page
  .get('/podcasts/:id', getLoggedInUserInfo, (req, res) => {
    let pageIndex = req.query.page || 1;
    let offset = (pageIndex * 50) - 50;
    let params = {};

    params.offset = offset;
    params.paginateLimit = 50;

    return PodcastService.get(req.params.id, params)
      .then(podcast => {
        // TODO: this is a buggy way of handling pagination. 1/50 times you can
        // press next and it will load an empty page. I couldn't get the pagination
        // query to work properly in PodcastService.get in the episode include
        // properties.
        let total = podcast.episodes.length;
        let showNextButton = (total > 0 && total % 50 === 0) ? true : false;

        req.params.podcastFeedURL = podcast.feedURL;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {
          res.render('podcast/index.html', {
            podcast: podcast,
            pageIndex: pageIndex,
            showNextButton: showNextButton,
            currentPage: 'Podcast Detail Page',
            isSubscribed: isSubscribed,
            locals: res.locals
          });


        });
      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  .use('podcasts', locator.get('PodcastService'))

  // Alias URL for the Episode Detail Page based on mediaURL
  .get('/episodes/alias', (req, res) => {
    return EpisodeService.get('alias', {mediaURL: req.query.mediaURL})
      .then(episode => {
        res.redirect('/episodes/' + episode.dataValues.id);
      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  // Episode Detail Page
  .get('/episodes/:id', getLoggedInUserInfo, (req, res) => {
    return EpisodeService.get(req.params.id)
      .then(episode => {
        req.params.podcastFeedURL = episode.podcast.feedURL;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {
          episode.dataValues['isSubscribed'] = isSubscribed;

          return new Promise((resolve, reject) => {
            gatherUsersOwnedPlaylists(resolve, reject, req);
          })
            .then((usersOwnedPlaylists) => {
              episode.dataValues['usersOwnedPlaylists'] = usersOwnedPlaylists;
              episode.dataValues['currentPage'] = 'Episode Detail Page';
              episode.dataValues['locals'] = res.locals;
              res.render('player-page/index.html', episode.dataValues);
            })
        })
      }).catch(e => {
        res.sendStatus(404);
      });
  })

  .use('episodes', locator.get('EpisodeService'))

  .post('/podcasts/subscribe', function (req, res) {
    UserService.update(req.feathers.userId, {}, {
      subscribeToPodcastFeedURL: req.body.podcastFeedURL,
      userId: req.feathers.userId
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        console.log(e);
        throw new errors.GeneralError(e);
      });
  })

  .post('/podcasts/unsubscribe', function (req, res) {
    UserService.update(req.feathers.userId, {}, {
      unsubscribeFromPodcastFeedURL: req.body.podcastFeedURL,
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

  .post('/playlists/subscribe/:id', function (req, res) {
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

  .post('/playlists/unsubscribe/:id', function (req, res) {
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

  .post('/playlists/:playlistId/addItem/', function (req, res) {

    PlaylistService.get(req.params.playlistId)
      .then(playlist => {

        if (!req.body.mediaRefId) {
          throw new errors.GeneralError('A mediaRefId must be provided as a query parameter.');
        }

        // NOTE: this if/else beast here converts episode's into mediaRefs so that the episode can be
        // added to a playlist as a mediaRef, AND to make sure that one episode only has one mediaRef
        // instance of itself.

        if (req.body.mediaRefId.indexOf('episode_') > -1) {

          let episodeMediaURL = req.body.mediaRefId.replace('episode_', '');

          EpisodeService.find({mediaURL: episodeMediaURL})
            .then(episodes => {
              if (!episodes || episodes.length < 1) {
                throw new errors.GeneralError('No episode found matching that mediaURL.')
              }

              let episode = episodes[0];

              // Convert the episode into a mediaRef object
              let epMediaRef = {};
              epMediaRef.title = episode.title;
              epMediaRef.startTime = 0;
              epMediaRef.ownerId = req.feathers.userId;
              epMediaRef.podcastTitle = episode.podcast.title;
              epMediaRef.podcastFeedURL = episode.podcast.feedURL;
              epMediaRef.podcastImageURL = episode.podcast.imageURL;
              epMediaRef.episodeTitle = episode.title;
              epMediaRef.episodeMediaURL = episode.mediaURL;
              epMediaRef.episodeImageURL = episode.imageURL;
              epMediaRef.episodePubDate = episode.pubDate;

              // Find all mediaRefs with at least one episode where episode.feedURL === feedURL

              MediaRef.findOrCreate({
                where: {
                  episodeMediaURL: episodeMediaURL,
                  startTime: 0,
                  $and: {
                    endTime: null
                  }
                },
                defaults: epMediaRef
              })
                .then(mediaRefArray => {
                  let mediaRef = mediaRefArray[0];
                  playlist.dataValues['playlistItems'] = [mediaRef.dataValues.id];
                  PlaylistService.update(req.params.playlistId, playlist.dataValues, {
                    userId: req.feathers.userId,
                    isFullEpisode: true
                  })
                    .then(updatedPlaylist => {
                      res.send(200, updatedPlaylist);
                    })
                })
            })
            .catch(e => {
              console.log(e);
            })
        } else {
          playlist.dataValues['playlistItems'] = [req.body.mediaRefId];
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

  .get('/my-podcasts', getLoggedInUserInfo, (req, res) => {

    UserService.retrieveUserAndAllSubscribedPodcasts(req.feathers.userId, {
      userId: req.feathers.userId
    })
      .then(user => {
        user.dataValues['currentPage'] = 'My Podcasts Page';
        user.dataValues['locals'] = res.locals;
        res.render('my-podcasts/index.html', user.dataValues);
      })
      .catch(e => {
        console.log(e);
        // redirect to home page is unauthorized
        res.redirect('/');
      });
  })

  .get('/my-playlists', getLoggedInUserInfo, (req, res) => {
    UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        user.dataValues['mySubscribedPlaylists'] = user.playlists;

        let recommendedForMe = user.playlists.filter(function (p) {
          return (p.ownerId !== req.feathers.userId && p.isRecommendation === true);
        });

        user.dataValues['recommendedForMe'] = recommendedForMe;

        return PlaylistService.find({ query: { ownerId: req.feathers.userId, isRecommendation: true }})
          .then(myRecommendations => {
            user.dataValues['recommendedByMe'] = myRecommendations;
            user.dataValues['currentPage'] = 'My Playlists Page';
            user.dataValues['locals'] = res.locals;
            res.render('my-playlists/index.html', user.dataValues);
          })
      })
      .catch(e => {
        // redirect to home page is unauthorized
        res.redirect('/');
      });
  })

  .get('/login-redirect', function (req, res) {
    req.query['currentPage'] = 'Login Redirect Page';
    res.render('login/redirect.html', req.query);
  })

  .get('/settings', getLoggedInUserInfo, function (req, res) {
    UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        user.dataValues['currentPage'] = 'Settings Page';
        user.dataValues['locals'] = res.locals;
        res.render('settings/index.html', user.dataValues);
      })
      .catch(e => {
        // redirect to home page is unauthorized
        res.redirect('/');
      });
  })

  .get('/about', getLoggedInUserInfo, function (req, res) {
    req.query['currentPage'] = 'About Page';
    req.query['locals'] = res.locals;
    res.render('about/index.html', req.query);
  });

}

function getUsersSubscribedPodcastFeedURLs (resolve, reject, req) {
  if (isNonAnonUser(req.feathers.userId)) {
    const UserService = locator.get('UserService');
    return UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        let subscribedPodcastFeedURLs = user.subscribedPodcastFeedURLs;
        resolve(subscribedPodcastFeedURLs);
      })
      .catch(e => {
        reject(e);
      })
  } else {
    resolve(false);
  }
}

function isUserSubscribedToThisPodcast (resolve, reject, req) {
  if (isNonAnonUser(req.feathers.userId)) {
    const UserService = locator.get('UserService');
    return UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        let isUserSubscribed = user.dataValues.subscribedPodcastFeedURLs.some(podcastFeedURL => {
          return podcastFeedURL === req.params.podcastFeedURL;
        });
        resolve(isUserSubscribed);
      })
      .catch(e => {
        console.log(e);
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

function gatherUsersOwnedPlaylists(resolve, reject, req) {
  if (isNonAnonUser(req.feathers.userId)) {
    const PlaylistService = locator.get('PlaylistService');
    return PlaylistService.find(({query :{ ownerId: req.feathers.userId } }))
      .then(usersOwnedPlaylists => {
        resolve(usersOwnedPlaylists);
      })
      .catch(e => {
        console.log(e);
        reject(e);
      })
  } else {
    resolve(false);
  }
}

module.exports = {routes};
