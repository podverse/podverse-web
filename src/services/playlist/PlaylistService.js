const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    config = require('config.js'),
    {locator} = require('locator.js'),
    {applyOwnerId} = require('hooks/common.js');

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
      create: [applyOwnerId],
      update: [applyOwnerId]
    };

    this.after = { };
  }

  _transformAfterRetrieval (data) {
    // Add in URL
    let id = data.slug || data.id;
    data.url = `${config.baseURL}/pl/${id}`;

    return data;
  }

  _transformBeforeSave (data) {

    delete data.url;

    data.slug = data.slug || data.id;
    data.items = data.items || [];

    return data;
  }

  get (id, params={}) {
    const {MediaRef} = this.Models;

    return this.Model.findOne({
      where: {
        $or: [
          {id:id},
          {slug:id}
        ]
      },
      include: [
        { model: MediaRef, through: 'items' }
      ]
    }).then(playlist => {
      playlist = this._transformAfterRetrieval(playlist);
      return playlist
    }).catch(e => {
      return new errors.GeneralError(e);
    });
  }

  create (data) {
    data = this._transformBeforeSave(data);

    return this.Model.create(data)
      .then(pl => {
        return pl.setMediaRefs(data.items).then(() => {
          return this._transformAfterRetrieval(pl);
        })
      });
  }

  update (id, data, params) {

    if (!id) {
      throw new errors.NotAcceptable(`Try using POST instead of PUT.`);
    }

    data = this._transformBeforeSave(data);
    return this.Model.update(data, {
      where: {
        $or: [
          {id: id},
          {slug: id}
        ]
      }
    }).then(rows => {
      if (rows[0] === 0) {
        throw new errors.NotFound(`Could not find a playlist by "${id}"`)
      }

      return this.Models.Playlist.findById(id)
        .then(pl => {
          return pl.addMediaRefs(data.items).then(() => {
            return super.update(id, data, params);
          });
        });
    });

  }

}

PlaylistService.prototype.remove = undefined;
PlaylistService.prototype.patch = undefined;

module.exports = PlaylistService;
