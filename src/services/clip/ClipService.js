const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    {applyOwnerId} = require('hooks/common.js'),
    config = require('config.js'),
    {locator} = require('locator.js'),
    {addURL} = require('hooks/clip/clip.js'),
    {isClipMediaRefForPodcast} = require('constants.js'),
    sqlEngine = locator.get('sqlEngine');

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

  retrievePodcastsMostPopularClips (params={}) {
    let clipQuery = isClipMediaRefForPodcast(params);

    params.sequelize = {
      where: clipQuery,
      order: [
        [sqlEngine.fn('max', sqlEngine.col(params.filterTypeQuery)), 'DESC']
      ],
      group: ['id']
    };

    return super.find(params);
  }

}

ClipService.prototype.remove = undefined;
ClipService.prototype.patch = undefined;

module.exports = ClipService;
