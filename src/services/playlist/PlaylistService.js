const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    config = require('config.js'),
    {locator} = require('locator.js'),
    {applyOwnerId} = require('hooks/common.js'),
    {addURL} = require('hooks/playlist/playlist.js'),
    {isUUID} = require('validator');

class PlaylistService extends SequelizeService {

  constructor () {
    const sqlEngine = locator.get('sqlEngine');
    const Models = locator.get('Models');

    super({
      Model: Models.Playlist
    });

    this.sqlEngine = sqlEngine;
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

  _transformBeforeSave (data) {

    delete data.url;

    data.slug = data.slug || data.id;
    data.playlistItems = data.playlistItems || [];

    return data;
  }

  get (id /*, params={} */) {
    const {MediaRef} = this.Models;

    if (!id) {
      throw new errors.GeneralError();
    }

    return this.Model.findOne({
      where: {id},
      include: {
        model: MediaRef,
        through: 'playlistItems'
      }
    }).then(playlist => {
      return playlist
    }).catch(e => {
      return new errors.GeneralError(e);
    });
  }

  find (params={}) {
    if (!params.query || Object.keys(params.query).length < 1) {
      throw new errors.GeneralError('A parameter must be provided to the Playlist find service.');
    }

    const {MediaRef} = this.Models;

    params.sequelize = {
      include: {
        model: MediaRef,
        through: 'playlistItems'
      }
    };

    return super.find(params);
  }

  create (data) {
    data = this._transformBeforeSave(data);

    const {User} = this.Models;
    return User.findById(data.ownerId)
      .then(user => {
        data.ownerName = user.name || '';
        return this.Model.create(data)
          .then(pl => {
            return pl.setMediaRefs(data.playlistItems)
              .then(() => {
                return user.addPlaylists([pl.id])
                  .then(() => {
                    return pl;
                  });
              });
            });
      })
      .catch(e => {
        throw new errors.GeneralError(e);
      });

  }

  update (id, data, params={}) {
    const {MediaRef} = this.Models;

    if (!id) {
      throw new errors.NotAcceptable(`Try using POST instead of PUT.`);
    }

    return this.Model.findOne({
      where: {
        $or: [
          {id: id},
          {slug: id}
        ]
      },
      include: [MediaRef]
    }).then(pl => {

      if (pl === null) {
        throw new errors.NotFound(`Could not find a playlist by "${id}"`)
      }

      if (!pl.ownerId || pl.ownerId !== params.userId) {
        throw new errors.Forbidden();
      }

      if (pl.isMyClips && params.isFullEpisode) {
        // TODO: send this error to the front end in an alert box for the user
        // TODO: add test for this after alert box is handled
        throw new errors.GeneralError(`Sorry folks! You can't add full episodes to the My Clips playlist.`);
      }

      let playlistItemCount = (pl.mediaRefs && pl.mediaRefs.length) || 0;

      data = this._transformBeforeSave(data);

      return this.Model.update(data, {
        where: {
          id: id
        }
      }).then(() => {

        if (params.addPlaylistItemsToPlaylist) {

          return pl.addMediaRefs(data.playlistItems)
          .then((result) => {
            // NOTE: this assumes you are only adding one association at a time
            let changed = 0;
            if (result[0] && result[0].length) {
              changed++;
            }
            return playlistItemCount + changed;
          });

        } else if (params.removePlaylistItemsFromPlaylist) {

          return pl.removeMediaRefs(data.playlistItems)
          .then((result) => {
            // NOTE: this assumes you are only deleting one association at a time
            return playlistItemCount - 1;
          });

        } else {
          return this.get(id, params);
        }

      });

    }).catch(e => {
      console.log(e);
    });

  }

  retrieveUsersPlaylists(ownerId) {
    return this.sqlEngine.query(`
      SELECT p.id, p.slug, p.title, p."ownerId", p."dateCreated",
      p."lastUpdated", p."isMyClips", (
        SELECT COUNT(*)
        FROM "playlistItems"
        WHERE "playlistId"=p.id
      ) AS "itemCount"
      FROM playlists p
      WHERE "ownerId"='${ownerId}';
    `, { type: this.sqlEngine.QueryTypes.SELECT });
  }

}

PlaylistService.prototype.remove = undefined;
PlaylistService.prototype.patch = undefined;

module.exports = PlaylistService;
