
const SequelizeService = require('feathers-sequelize').Service;
const errors = require('feathers-errors');
const config = require('config.js');

const {applyOwnerId} = require('hooks/common.js');

class PlaylistService extends SequelizeService {

  constructor ({Models}={}) {
    super({Model: Models.Playlist});
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

  get (id, params) {
    return this.Model.findOne({
      where: {
        $or: [
          {id:id},
          {slug:id}
        ]
      }
    }).then(playlist => {
      playlist = this._transformAfterRetrieval(playlist);
      return playlist
    }).catch(err => {
      return new errors.GeneralError(err);
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

  update (id, data) {

    // Make sure the data slug reflects the playlist we're posting
    // TODO: do we need this line?
    // data.slug = id;

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
    });

  }

}

PlaylistService.prototype.remove = undefined;
PlaylistService.prototype.patch = undefined;

module.exports = PlaylistService;
