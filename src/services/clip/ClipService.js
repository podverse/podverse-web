const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    {applyOwnerId} = require('hooks/common.js'),
    config = require('config.js'),
    {locator} = require('locator.js'),
    {addUrl} = require('hooks/clip/clip.js'),
    {isClipMediaRef, allowedFilters, isFilterAllowed} = require('constants.js'),
    sqlEngine = locator.get('sqlEngine'),
    {filterTypeNotAllowedMessage} = require('errors.js'),
    validUrl = require('valid-url');

class ClipService extends SequelizeService {

  constructor () {

    const Models = locator.get('Models');

    super({
      Model: Models.MediaRef
    });
    this.Models = Models;

    // Hooks
    // -----
    this.before = {
      create: [applyOwnerId]
    };

    this.after = {
      get: [addUrl],
      create: [addUrl],
      update: [addUrl]
    };

  }

  get (id, params={}) {
    return super.get(id, params);
  }

  find (params={}) {
    if (!params.sequelize) {
      throw new errors.GeneralError('Parameters must be provided to the Clip find service.');
    }

    return super.find(params);
  }

  create (data, params={}) {

    return new Promise((resolve, reject) => {

      const {MediaRef, Playlist, User} = this.Models;
      const PlaylistService = locator.get('PlaylistService');

      if (data.endTime === '') {
        data.endTime = null;
      }

      if (data.episodeDuration === '') {
        data.episodeDuration = null;
      }

      return MediaRef.create(data)
        .then((c) => {
          // If user is logged in, then add the clip to their My Clips playlist
          if (params.userId) {

            return User.findById(params.userId)
              .then(user => {

                let ownerName = user.name || '';
                let myClipsPlaylist = {};
                myClipsPlaylist.title = 'My Clips';
                myClipsPlaylist.isMyClips = true;
                myClipsPlaylist.ownerName = ownerName;

                return Playlist.findOrCreate({
                  where: {
                    ownerId: params.userId,
                    $and: {
                      isMyClips: true
                    }
                  },
                  defaults: myClipsPlaylist
                }).then(playlists => {
                    let playlist = playlists[0];

                    return user.addPlaylists([playlist.id])
                      .then(() => {
                        playlist.dataValues.playlistItems = [c.id];
                        return PlaylistService.update(playlist.dataValues.id, playlist.dataValues, {
                          userId: params.userId,
                          addPlaylistItemsToPlaylist: true
                        })
                          .then(updatedPlaylist => {
                            resolve(c);
                          })
                      })
                })
            })
          } else {
            resolve(c);
          }

        })
        .catch(e => {
          console.log(e);
          reject(new errors.GeneralError(e));
        });

    });
  }

  update (id, data, params={}) {

    return this.Models.MediaRef.findById(id)
      .then(mediaRef => {

        if (!mediaRef.ownerId || mediaRef.ownerId !== params.userId) {
          throw new errors.Forbidden();
        } else {
          return super.update(id, data, params);
        }

      });
  }

  retrievePaginatedClips(filterType, podcastFeedUrls, episodeMediaUrl, pageIndex) {

    return new Promise((resolve, reject) => {

      podcastFeedUrls.forEach(podcastFeedUrl => {
        if (podcastFeedUrl && !validUrl.isUri(podcastFeedUrl)) {
          throw new errors.GeneralError(`Invalid URL ${podcastFeedUrl} provided for podcastFeedUrl`, 404);
        }
      });

      if (episodeMediaUrl && !validUrl.isUri(episodeMediaUrl)) {
        throw new errors.GeneralError(`Invalid URL ${episodeMediaUrl} provided for episodeMediaUrl`, 404);
      }

      if (process.env.NODE_ENV != 'production') {
        filterType = 'recent';
      }

      if (!isFilterAllowed(filterType)) {
        throw new errors.GeneralError(filterTypeNotAllowedMessage(filterType), 404);
      }

      let params = {},
          offset = (pageIndex * 10) - 10,
          clipQuery = isClipMediaRef(podcastFeedUrls, episodeMediaUrl);

      params.sequelize = {
        where: clipQuery,
        offset: offset,
        order: [
          [sqlEngine.fn('max', sqlEngine.col(allowedFilters[filterType].query)), 'DESC']
        ],
        group: ['id']
      };

      params.paginate = {
        default: 10,
        max: 1000
      };

      return super.find(params)
      .then(page => {
        resolve(page);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });

    });

  }

  convertEpisodeToMediaRef(episode, userId) {

    // Convert the episode into a mediaRef object
    let epMediaRef = {};
    epMediaRef.title = episode.title;
    epMediaRef.startTime = 0;
    epMediaRef.ownerId = userId;
    epMediaRef.podcastTitle = episode.podcast.title;
    epMediaRef.podcastFeedUrl = episode.podcast.feedUrl;
    epMediaRef.podcastImageUrl = episode.podcast.imageUrl;
    epMediaRef.episodeTitle = episode.title;
    epMediaRef.episodeMediaUrl = episode.mediaUrl;
    epMediaRef.episodeImageUrl = episode.imageUrl;
    epMediaRef.episodeLinkUrl = episode.link;
    epMediaRef.episodePubDate = episode.pubDate;
    epMediaRef.episodeSummary = episode.summary;

    return epMediaRef;
  }

  pruneEpisodeMediaRef(item) {
    // Convert the episode into a mediaRef object
    let epMediaRef = {};
    epMediaRef.mediaRefId = null
    epMediaRef.title = item.episodeTitle;
    epMediaRef.startTime = 0;
    epMediaRef.ownerId = item.ownerId;
    epMediaRef.podcastTitle = item.podcastTitle;
    epMediaRef.podcastFeedUrl = item.podcastFeedUrl;
    epMediaRef.podcastImageUrl = item.podcastImageUrl;
    epMediaRef.episodeTitle = item.episodeTitle;
    epMediaRef.episodeMediaUrl = item.episodeMediaUrl;
    epMediaRef.episodeImageUrl = item.episodeImageUrl;
    epMediaRef.episodeLinkUrl = item.episodeLinkUrl;
    epMediaRef.episodePubDate = item.episodePubDate;
    epMediaRef.episodeSummary = item.episodeSummary;

    return epMediaRef;
  }

}

ClipService.prototype.remove = undefined;
ClipService.prototype.patch = undefined;

module.exports = ClipService;
