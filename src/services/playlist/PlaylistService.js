const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    config = require('config.js'),
    {locator} = require('locator.js'),
    {ensureAuthenticated, applyOwnerId} = require('hooks/common.js'),
    {addURL} = require('hooks/playlist/playlist.js');

class PlaylistService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');

    super({
      Model: Models.Playlist
    });
    this.Models = Models;

    // Hooks
    // -----
    this.before = {
      create: [ensureAuthenticated, applyOwnerId],
      update: [ensureAuthenticated]
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

  get (id, params={}) {
    const {MediaRef, Episode, Podcast} = this.Models;

    return this.Model.findOne({
      where: {
        $or: [
          {id:id},
          {slug:id}
        ]
      },
      include: [
        { model: MediaRef,
          through: 'playlistItems',
          include: [{
            model: Episode, include: [Podcast]
          }]}
      ]
    }).then(playlist => {
      return playlist
    }).catch(e => {
      return new errors.GeneralError(e);
    });
  }

  find (params={}) {
    const {MediaRef, Episode, Podcast} = this.Models;

    params.sequelize = {
      include: [
        { model: MediaRef,
          through: 'playlistItems',
          include: [{
            model: Episode, include: [Podcast]
          }]
        }
      ]
    };

    return super.find(params);
  }

  create (data) {
    data = this._transformBeforeSave(data);

    return this.Model.create(data)
      .then(pl => {
        return pl.setMediaRefs(data.playlistItems).then(() => {
          return pl;
        })
      });
  }

  update (id, data, params={}) {

    if (!id) {
      throw new errors.NotAcceptable(`Try using POST instead of PUT.`);
    }

    return this.Model.findOne({
      where: {
        $or: [
          {id: id},
          {slug: id}
        ]
      }
    }).then(pl => {
      if (pl === null) {
        throw new errors.NotFound(`Could not find a playlist by "${id}"`)
      }

      if (pl.ownerId !== params.userId) {
        throw new errors.Forbidden();
      }

      data = this._transformBeforeSave(data);

      return pl.addMediaRefs(data.playlistItems)
        .then(() => {
          return this.Model.update(data, {
            where: {
              id: id
            }
          })
            .then(() => {
              return this.get(id, params);
            });
        });

    }).catch(e => {
      throw new errors.GeneralError(e);
    });

  }

}

PlaylistService.prototype.remove = undefined;
PlaylistService.prototype.patch = undefined;

module.exports = PlaylistService;
