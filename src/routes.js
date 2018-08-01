const
    errors = require('feathers-errors'),
    {locator} = require('./locator.js'),
    {allowedFilterTypes, allowedSortTypes} = require('./constants.js'),
    {getLoggedInUserInfo} = require('./middleware/auth/getLoggedInUserInfo.js'),
    {cache} = require('./middleware/cache'),
    {isNonAnonUser, removeArticles, shouldShowNextButton} = require('./util.js'),
    {generatePlaylistRSSFeed} = require('./services/playlist/PlaylistRSSService.js'),
    _ = require('lodash'),
    fs = require('fs');

function routes () {
  const app = this,
        Models = locator.get('Models'),
        {MediaRef} = Models,
        PodcastService = locator.get('PodcastService'),
        EpisodeService = locator.get('EpisodeService'),
        FeedUrlService = locator.get('FeedUrlService'),
        ClipService = locator.get('ClipService'),
        PlaylistService = locator.get('PlaylistService'),
        UserService = locator.get('UserService'),
        sqlEngine = locator.get('sqlEngine');

  app.get('/', getLoggedInUserInfo, function (req, res) {

    let filterType = req.query.filter || 'all';
    let sortType = req.query.sort || 'pastWeek';
    let pageIndex = req.query.page || 1;

    if (isNonAnonUser(req.feathers.userId) && filterType === 'subscribed') {
      return new Promise((resolve, reject) => {
        getUsersSubscribedPodcastIds(resolve, reject, req);
      })
        .then(subscribedPodcastIds => {

          if (!subscribedPodcastIds || subscribedPodcastIds.length === 0) {
            let allowedFilter = allowedFilterTypes[filterType] || {};
            let filterDropdownText = allowedFilter.dropdownText;
  
            let allowedSort = allowedSortTypes[sortType] || {};
            let sortDropdownText = allowedSort.dropdownText;
  
            res.render('home/index.html', {
              filterDropdownText,
              sortDropdownText,
              subscribeToPodcastsMsg: true,
              currentPage: 'Home Page',
              locals: res.locals
            });
          } else {
            return handleHomePageClipQueryRequest(req, res, filterType, sortType, subscribedPodcastIds, [], null, pageIndex);
          }

        });
    } else if (isNonAnonUser(req.feathers.userId) && filterType === 'myClips') {
      return handleHomePageClipQueryRequest(req, res, filterType, sortType, [], [], req.feathers.userId, pageIndex);
    } else {
      return handleHomePageClipQueryRequest(req, res, filterType, sortType, [], [], null, pageIndex);
    }

  })

  // Search page
  .get('/search', getLoggedInUserInfo, (req, res) => {
    res.locals.searchQuery = req.query.query;

    res.render('search/index.html', {
      currentPage: 'Search Page',
      locals: res.locals
    });
  })

  // Clip Detail Page
  .get('/clips/:id', getLoggedInUserInfo, (req, res) => {
    return ClipService.get(req.params.id, {userId: req.feathers.userId})
      .then((mediaRef) => {
        req.params.podcastId = mediaRef.podcastId;
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
        res.status(404).render('404.html');
      });
  })

  // Clip Remove endpoint
  .delete('/clips/:id', getLoggedInUserInfo, (req, res) => {
    return ClipService.remove(req.params.id, { userId: req.feathers.userId })
      .then(() => {
        res.status(200).send();
      }).catch(e => {
        console.log(e);
        
        res.sendStatus(500);
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
            getUsersSubscribedPodcastIds(resolve, reject, req);
          })
            .then((subscribedPodcastIds) => {
              subscribedPodcastIds = subscribedPodcastIds || [];
              mediaRefs.forEach(mediaRef => {
                if (subscribedPodcastIds.includes(mediaRef.podcastFeedUrl)) {
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
        res.status(404).render('404.html');
      });
  })

  // Playlist Remove endpoint
  .delete('/playlists/:id', getLoggedInUserInfo, (req, res) => {
    return PlaylistService.remove(req.params.id, { userId: req.feathers.userId })
      .then(() => {
        res.status(200).send();
      }).catch(e => {
        console.log(e);
        res.sendStatus(500);
      });
  })

  .use('playlists', locator.get('PlaylistService'))

  // Alias Url for the Podcast Detail Page based on podcastFeedUrl
  .get('/podcasts/alias', (req, res) => {
    return PodcastService.findPodcastByFeedUrl(req.query.feedUrl)
      .then(podcast => {
        res.redirect('/podcasts/' + podcast.dataValues.id);
      }).catch(e => {
        res.status(404).render('404.html');
      });
  })

  .get('/podcasts/isSubscribed', getLoggedInUserInfo, (req, res) => {
    req.params.podcastId = req.query.podcastId;

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
    let params = {};

    return PodcastService.get(req.params.id, params)
      .then(podcast => {

        return FeedUrlService.findPodcastAuthorityFeedUrl(req.params.id)
          .then(feedUrl => {

            req.params.podcastId = podcast.id; // needed to determine if user is subscribed
            podcast.feedUrl = feedUrl; // needed by the front-end

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
          })

        });
      }).catch(e => {
        res.status(404).render('404.html');
      });
  })

  // Podcast Detail Page (Clips)
  .get('/podcasts/clips/:id', getLoggedInUserInfo, (req, res) => {
    return PodcastService.get(req.params.id)
      .then(podcast => {

        return FeedUrlService.findPodcastAuthorityFeedUrl(req.params.id)
          .then(feedUrl => {

            req.params.podcastId = podcast.id; // needed to determine if user is subscribed
            podcast.feedUrl = feedUrl; // needed by the front-end

            return new Promise((resolve, reject) => {
              isUserSubscribedToThisPodcast(resolve, reject, req);
            })
            .then((isSubscribed) => {

              let sortType = req.query.sort || 'pastWeek';
              let pageIndex = req.query.page || 1;

              return ClipService.retrievePaginatedClips(sortType, [], [feedUrl], null, null, pageIndex)
              .then(page => {
                podcast.clips = page.data;
                res.render('podcast/index.html', {
                  podcast: podcast,
                  sortDropdownText: allowedSortTypes[sortType].dropdownText,
                  currentPage: 'Podcast Detail Page',
                  isSubscribed: isSubscribed,
                  isClipsView: true,
                  locals: res.locals
                });
              })
              .catch(err => {
                console.log(req.params.id);
                res.status(404).render('404.html');
              });

          })

        });
      }).catch(e => {
        res.status(404).render('404.html');
      });
  })

  // Retrieve an individual clip if only an id is provided,
  // else query for a list of clips.
  .post('/api/clips', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let id = req.body.id;

    if (id) {  
      return ClipService.get(id)
        .then(clip => {
          res.send(JSON.stringify(clip));
        })
        .catch(e => {
          res.sendStatus(404);
        });

    } else {

      let sortType = req.body.sortType || 'pastWeek';
      let pageIndex = req.body.page || 1;
      let podcastIds = req.body.podcastIds || [];
      let podcastFeedUrls = req.body.podcastFeedUrls || [];
      let episodeMediaUrl = req.body.episodeMediaUrl;
      let userId = req.body.userId;

      return ClipService.retrievePaginatedClips(sortType, podcastIds, podcastFeedUrls, episodeMediaUrl, userId, pageIndex)
        .then(page => {
          res.send(JSON.stringify(page));
        })
        .catch(e => {
          res.sendStatus(404);
        });
    }
  })

  // Retrieve an episode's data as JSON
  .post('/api/episodes', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    let id = req.body.id;

    return EpisodeService.get(id)
      .then(episode => {
        res.send(JSON.stringify(episode));
      })
      .catch(e => {
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
        res.sendStatus(404);
      });
  })

  .get('/api/podcasts', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let id = req.query.id;
    let excludeEpisodes = req.query.excludeEpisodes;

    return PodcastService.get(id, {excludeEpisodes})
      .then(podcast => {
        res.send(JSON.stringify(podcast));
      })
      .catch(err => {
        console.log('/api/podcasts error, id:', id);
        console.log(err);
        res.send(500);
      });
  })

  .get('/api/podcasts/authorityFeedUrl', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let id = req.query.id;

    return FeedUrlService.findPodcastAuthorityFeedUrl(id)
      .then(feedUrl => {
        res.send(feedUrl);
      })
      .catch(err => {
        console.log('/api/podcasts/authorityFeedUrl error, id:', id);
        console.log(err);
        res.send(500);
      });
  })

  // Retrieve the logged-in user's subscribed podcasts data as JSON objects in an array
  .post('/api/user/podcasts', getLoggedInUserInfo, (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    let userId = req.feathers.userId;

    UserService.retrieveUserAndAllSubscribedPodcasts(userId, {
      userId: userId
    })
    .then(user => {

      // let podcasts = user.dataValues.subscribedPodcasts;
      //
      // podcasts = _.reduce(podcasts, (acc, podcast) => {
      //   if (podcast.title && podcast.title.length > 0) {
      //     acc.push(podcast);
      //   }
      //   return acc;
      // }, []);
      //
      // podcasts = _.sortBy(podcasts, (podcast) => {
      //   let title = podcast.title;
      //   title = title.toLowerCase();
      //   title = removeArticles(title);
      //   return title;
      // });

      res.send(JSON.stringify(user));

    })
    .catch(e => {
      console.log(e);
      res.sendStatus(401);
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
        res.sendStatus(401);
      });

  })

  .use('podcasts', locator.get('PodcastService'))

  // Alias Url for the Episode Detail Page based on mediaUrl
  .get('/episodes/alias', (req, res) => {

    return EpisodeService.get('alias', {mediaUrl: req.query.mediaUrl})
      .then(episode => {
        res.redirect('/episodes/' + episode.id);
      }).catch(e => {
        res.status(404).render('404.html');
      });
  })

  // Episode Detail Page
  .get('/episodes/:id', getLoggedInUserInfo, (req, res) => {

    let startTimeOverride = req.query.s ? parseInt(req.query.s) : null;
    let endTimeOverride = req.query.e ? parseInt(req.query.e) : null;

    return EpisodeService.get(req.params.id)
      .then(episode => {

        return FeedUrlService.findPodcastAuthorityFeedUrl(episode.podcastId)
        .then(feedUrl => {

          episode.dataValues['podcastId'] = episode.podcastId;
          episode.dataValues['podcastFeedUrl'] = feedUrl;
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

        })

      }).catch(e => {
        res.status(404).render('404.html');
      });
  })

  .use('episodes', locator.get('EpisodeService'))

  .post('/podcasts/subscribe', function (req, res) {

    UserService.update(req.feathers.userId, {}, {
      subscribeToPodcastId: req.body.podcastId,
      userId: req.feathers.userId
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        console.log('/podcasts/subscribe', e);
        throw new errors.GeneralError(e);
      });
  })

  .post('/podcasts/unsubscribe', function (req, res) {
    UserService.update(req.feathers.userId, {}, {
      unsubscribeFromPodcastId: req.body.podcastId,
      userId: req.feathers.userId
    })
      .then(user => {
        res.sendStatus(200);
      })
      .catch(e => {
        console.log('/podcasts/unsubscribe', e);
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

          let episodeMediaUrl = req.body.mediaRefId.replace('episode_', '');

          EpisodeService.get('alias', {mediaUrl: episodeMediaUrl})
            .then(episode => {

              let epMediaRef = ClipService.pruneEpisodeMediaRef(req.body);

              ClipService.convertEpisodeToMediaRef(episode, req.feathers.userId)
                .then(mediaRef => {
                  if (mediaRef) {
                    epMediaRef = mediaRef;
                  }

                  // Find all mediaRefs with at least one episode where episode.feedUrl === feedUrl
                  MediaRef.findOrCreate({
                    where: {
                      episodeMediaUrl: episodeMediaUrl,
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

        if (user && user.dataValues) {
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
        } else {
          throw new errors.GeneralError('User id not found');
        }

      })
      .catch(e => {
        // redirect to home page if unauthorized
        res.redirect('/');
      });
  })

  .get('/my-playlists', getLoggedInUserInfo, (req, res) => {

    return new Promise((resolve, reject) => {
      gatherUsersOwnedPlaylists(resolve, reject, req);
    })
    .then((playlists) => {
      let dataValues = {};
      dataValues['mySubscribedPlaylists'] = playlists;
      dataValues['currentPage'] = 'My Playlists Page';
      dataValues['locals'] = res.locals;
      res.render('my-playlists/index.html', dataValues);
    })
    .catch(e => {
      // redirect to home page if unauthorized
      res.redirect('/');
    });

  })

  .get('/login-redirect', getLoggedInUserInfo, function (req, res) {
    req.query['currentPage'] = 'Login Redirect Page';
    req.query['locals'] = res.locals;
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

  .get('/contact', getLoggedInUserInfo, function (req, res) {
    req.query['currentPage'] = 'Contact Page';
    req.query['locals'] = res.locals;
    res.render('contact/index.html', req.query);
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
  })

  .get('/admin/random-id', function (req, res) {
    const shortid = require('shortid');
    const id = shortid();
    res.send(id);
  })

  .get('/apple-app-site-association', function (req, res) {
    const aasa = fs.readFileSync(__dirname + '/apple-app-site-association');
    res.status(200).send(aasa);
  })

  .use(getLoggedInUserInfo, function (req, res) {
    req.query['currentPage'] = '404 Not Found Page';
    req.query['locals'] = res.locals;
    res.status(404).render('404.html', req.query);
  });

  function handleHomePageClipQueryRequest(req, res, filterType, sortType, podcastIds, podcastFeedUrls, userId, pageIndex) {
    
    return ClipService.retrievePaginatedClips(sortType, podcastIds, podcastFeedUrls, null, userId, pageIndex)
      .then(page => {
        let clips = page.data;
        let total = page.total || [];
        let length = total.length;

        let allowedFilter = allowedFilterTypes[filterType] || {};
        let filterDropdownText = allowedFilter.dropdownText;

        let allowedSort = allowedSortTypes[sortType] || {};
        let sortDropdownText = allowedSort.dropdownText;

        res.render('home/index.html', {
          clips: clips,
          filterDropdownText,
          sortDropdownText,
          pageIndex: pageIndex,
          showNextButton: shouldShowNextButton(pageIndex, length),
          currentPage: 'Home Page',
          locals: res.locals
        });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(404);
      });
  } 

}

function getUsersSubscribedPodcastIds (resolve, reject, req) {
  if (isNonAnonUser(req.feathers.userId)) {
    const UserService = locator.get('UserService');
    return UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        let subscribedPodcastIds = user.subscribedPodcastIds || [];
        resolve(subscribedPodcastIds);
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
        if (user) {
          let isUserSubscribed = user.dataValues.subscribedPodcastIds.some(podcastId => {
            return podcastId === req.params.podcastId;
          });
          resolve(isUserSubscribed);
        } else {
          resolve(false);
        }
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
