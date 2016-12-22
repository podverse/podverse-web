const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    {applyOwnerId} = require('hooks/common.js'),
    config = require('config.js'),
    {locator} = require('locator.js'),
    {addURL} = require('hooks/clip/clip.js'),
    {isClipMediaRef} = require('constants.js');

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
      get: [addURL],
      create: [addURL],
      update: [addURL]
    };

  }

  get (id, params={}) {
    const {Episode, Podcast} = this.Models;

    params.sequelize = {
        include: [
          { model: Episode, include: [Podcast] }
        ]
    };

    return super.get(id, params);
  }

  find (params={}) {
    const {MediaRef, Episode, Podcast} = this.Models;

    if (!params.sequelize) {
      params.sequelize = {
        include: [{ model: Episode, include: [Podcast] }],
        where: isClipMediaRef
      };
    }

    return super.find(params);
  }

  create (data, params={}) {

    return new Promise((resolve, reject) => {

      const {MediaRef, Episode, Podcast, Playlist, User} = this.Models;
      const PlaylistService = locator.get('PlaylistService');

      let podcast = this._resolvePodcastData(data),
        episode = data.episode,
        isPodcastReferenced = !!podcast;
      if (isPodcastReferenced) {
        // Lets create/find the podcast
        return Podcast.findOrCreate({
          where: {
            $or: [
              { feedURL: podcast.feedURL },
              { id: podcast.id }
            ]
          },
          defaults: podcast
        })

        // Then create/find the episode
        .then(([podcast]) => {
          return Episode.findOrCreate({
            where: {
              $or: [
                { mediaURL: episode.mediaURL },
                { id: episode.id }
              ]
            },
            defaults: Object.assign({}, episode, {podcastId: podcast.id })
          });
        })

        // Then create the MediaRef
        .then(([episode]) => {
          const clip = Object.assign({}, data, {episodeId: episode.id});

          return MediaRef.create(clip)
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
                            return PlaylistService.update(playlist.dataValues.id, playlist.dataValues, { userId: params.userId })
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

        })

        .catch(e => {
          reject(new errors.GeneralError(e));
        });
      } else {
        reject(new errors.GeneralError('No podcast referenced'));
      }
    });
  }

  _resolvePodcastData(data) {
    if (data.episode && data.episode.podcast) {
      return data.episode.podcast;
    }
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

}

ClipService.prototype.remove = undefined;
ClipService.prototype.patch = undefined;

module.exports = ClipService;
