const
    errors = require('feathers-errors'),
    {locator} = require('locator.js'),
    {allowedFilters} = require('constants.js'),
    {getLoggedInUserInfo} = require('middleware/auth/getLoggedInUserInfo.js'),
    {cache} = require('middleware/cache'),
    {queryGoogleApiData} = require('services/googleapi/googleapi.js'),
    {isNonAnonUser, removeArticles, shouldShowNextButton} = require('util.js'),
    {generatePlaylistRSSFeed} = require('services/playlist/PlaylistRSSService.js'),
    _ = require('lodash');

function routes () {
  const app = this,
        Models = locator.get('Models'),
        {MediaRef} = Models,
        PodcastService = locator.get('PodcastService'),
        EpisodeService = locator.get('EpisodeService'),
        ClipService = locator.get('ClipService'),
        PlaylistService = locator.get('PlaylistService'),
        UserService = locator.get('UserService'),
        sqlEngine = locator.get('sqlEngine');

  app.get('/', getLoggedInUserInfo, function (req, res) {

    let filterType = req.query.sort || 'pastDay';
    let pageIndex = req.query.page || 1;

    return ClipService.retrievePaginatedClips(filterType, null, null, null, pageIndex)
    .then(page => {
      let clips = page.data;

      res.render('home/index.html', {
        clips: clips,
        dropdownText: allowedFilters[filterType].dropdownText,
        pageIndex: pageIndex,
        showNextButton: shouldShowNextButton(pageIndex, page.total.length),
        currentPage: 'Home Page',
        locals: res.locals
      });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
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

        // If rssFeed query parameter is present then return the RSS version of
        // the playlist. Else render the web page version of the playlist.
        if (req.query.rssFeed || req.query.rssFeed === '') {
          const rss = generatePlaylistRSSFeed(playlist);
          res.set('Content-Type', 'application/rss+xml');
          res.send(rss);
        } else {
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
        }
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

  // Show All Podcasts page can take a long time to load, so we're caching
  // it every 30 minutes. Also Pingdom is setup to hit this page every 15 minutes
  // to keep the page in memory.
  .get('/podcasts/list', getLoggedInUserInfo, cache(1800), (req, res) => {
    return PodcastService.retrieveAllPodcasts()
      .then(podcasts => {

        podcasts = _.reduce(podcasts, (acc, podcast) => {
          if (podcast.title && podcast.title.length > 0) {
            acc.push(podcast);
          }
          return acc;
        }, []);

        podcasts = _.sortBy(podcasts, (podcast) => {
          let title = podcast.title;
          title = title.toLowerCase();
          title = removeArticles(title);
          return title;
        });

        res.render('podcasts/index.html', {
          podcasts: podcasts,
          currentPage: 'Podcast List Page',
          locals: res.locals
        });
      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  // Podcast Detail Page (Episodes)
  .get('/podcasts/:id', getLoggedInUserInfo, (req, res) => {
    let params = {};

    return PodcastService.get(req.params.id, params)
      .then(podcast => {
        req.params.podcastFeedURL = podcast.feedURL;
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {

          podcast.episodes = _.reduce(podcast.episodes, (acc, episode) => {
            if (episode.isPublic === true)
              acc.push(episode)
            return acc;
          }, []);

          res.render('podcast/index.html', {
            podcast: podcast,
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

  // Podcast Detail Page (Clips)
  .get('/podcasts/clips/:id', getLoggedInUserInfo, (req, res) => {
    return PodcastService.get(req.params.id)
      .then(podcast => {

        req.params.podcastFeedURL = podcast.feedURL; // set on the request for isUserSubscribedToThisPodcast
        return new Promise((resolve, reject) => {
          isUserSubscribedToThisPodcast(resolve, reject, req);
        })
        .then((isSubscribed) => {

          let filterType = req.query.sort || 'pastDay';
          let pageIndex = req.query.page || 1;

          return ClipService.retrievePaginatedClips(filterType, podcast.feedURL, null, null, pageIndex)
          .then(page => {
            podcast.clips = page.data;
            res.render('podcast/index.html', {
              podcast: podcast,
              dropdownText: allowedFilters[filterType].dropdownText,
              currentPage: 'Podcast Detail Page',
              isSubscribed: isSubscribed,
              isClipsView: true,
              locals: res.locals
            });
          })
          .catch(err => {
            console.log(req.params.id);
            console.log(err);
            res.sendStatus(404);
          });
        });
      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  // Retrieve the most popular clips as JSON
  .post('/api/clips', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let filterType = req.body.filterType || 'pastWeek';
    let pageIndex = req.body.page || 1;
    let podcastFeedUrl = req.body.podcastFeedURL;
    let episodeMediaUrl = req.body.episodeMediaURL;
    let onlySubscribed = req.body.onlySubscribed || false;

    return ClipService.retrievePaginatedClips(filterType, podcastFeedUrl, episodeMediaUrl, onlySubscribed, pageIndex)
    .then(page => {
      res.send(JSON.stringify(page));
    })
    .catch(e => {
      console.log(e);
      res.sendStatus(404);
    });
  })

  // Retrieve the logged-in user's playlists as JSON
  .post('/api/user/playlists', getLoggedInUserInfo, (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    let ownerId = req.feathers.userId;

    return PlaylistService.retrieveUsersPlaylists(ownerId)
      .then(myPlaylists => {
        res.send(JSON.stringify(myPlaylists));
      })
      .catch(e => {
        console.log(e);
        res.sendStatus(404);
      });

  })

  // Retrieve a playlist's data as JSON
  .post('/api/playlist', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let id = req.body.id;

    return PlaylistService.get(id)
      .then(playlist => {
        res.send(JSON.stringify(playlist));
      })
      .catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  .use('podcasts', locator.get('PodcastService'))

  // Alias URL for the Episode Detail Page based on mediaURL
  .get('/episodes/alias', (req, res) => {
    return EpisodeService.get('alias', {mediaURL: req.query.mediaURL})
      .then(episode => {
        res.redirect('/episodes/' + episode.id);
      }).catch(e => {
        console.log(e);
        res.sendStatus(404);
      });
  })

  // Episode Detail Page
  .get('/episodes/:id', getLoggedInUserInfo, (req, res) => {

    let startTimeOverride = req.query.s ? parseInt(req.query.s) : null;
    let endTimeOverride = req.query.e ? parseInt(req.query.e) : null;

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
              episode.dataValues['startTimeOverride'] = startTimeOverride;
              episode.dataValues['endTimeOverride'] = endTimeOverride;
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

          EpisodeService.get('alias', {mediaURL: episodeMediaURL})
            .then(episode => {

              let epMediaRef;

              if (!!episode) {
                epMediaRef = ClipService.convertEpisodeToMediaRef(episode, req.feathers.userId);
              } else {
                epMediaRef = ClipService.pruneEpisodeMediaRef(req.body);
              }

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
                    isFullEpisode: true,
                    addPlaylistItemsToPlaylist: true
                  })
                    .then(updatedPlaylistItemCount => {
                      res.send(200, updatedPlaylistItemCount);
                    })
                })
            })
            .catch(e => {
              console.log(e);
            })
        } else {
          playlist.dataValues['playlistItems'] = [req.body.mediaRefId];
          PlaylistService.update(req.params.playlistId, playlist.dataValues,
            {
              userId: req.feathers.userId,
              addPlaylistItemsToPlaylist: true
            })
            .then(updatedPlaylistItemCount => {
              res.send(200, updatedPlaylistItemCount);
            })
        }

      })
      .catch(e => {
        res.sendStatus(500);
        throw new errors.GeneralError(e);
      });
  })

  .post('/playlists/:playlistId/removeItem/', function (req, res) {

    PlaylistService.get(req.params.playlistId)
    .then(playlist => {

      if (!req.body.mediaRefId) {
        throw new errors.GeneralError('A mediaRefId must be provided as a query parameter.');
      }

      playlist.dataValues['playlistItems'] = [req.body.mediaRefId];

      return PlaylistService.update(req.params.playlistId, playlist.dataValues, {
        userId: req.feathers.userId,
        removePlaylistItemsFromPlaylist: true
      })
      .then(updatedPlaylistItemCount => {
        res.send(200, updatedPlaylistItemCount);
      })

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

        let podcasts = user.dataValues.subscribedPodcasts;

        podcasts = _.reduce(podcasts, (acc, podcast) => {
          if (podcast.title && podcast.title.length > 0) {
            acc.push(podcast);
          }
          return acc;
        }, []);

        podcasts = _.sortBy(podcasts, (podcast) => {
          let title = podcast.title;
          title = title.toLowerCase();
          title = removeArticles(title);
          return title;
        });

        user.dataValues.subscribedPodcasts = podcasts;

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
  })

  .get('/terms', getLoggedInUserInfo, function (req, res) {
    req.query['currentPage'] = 'Terms Page';
    req.query['locals'] = res.locals;
    res.render('terms/index.html', req.query);
  })

  .get('/faq', getLoggedInUserInfo, function (req, res) {
    req.query['currentPage'] = 'FAQ Page';
    req.query['locals'] = res.locals;
    res.render('faq/index.html', req.query);
  })

  .get('/how-to', getLoggedInUserInfo, function (req, res) {
    req.query['currentPage'] = 'How-to Page';
    req.query['locals'] = res.locals;
    res.render('how-to/index.html', req.query);
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
