const errors = require('feathers-errors');
const SequelizeService = require('feathers-sequelize').Service;

const {applyOwnerId, ensureAuthenticated} = require('hooks/common.js');


class PlaylistService extends SequelizeService {

  constructor ({Models}={}) {
    super({
      Model: Models.MediaRef
    });
    this.Models = Models;

    // Hooks
    // -----
    this.before = {
      create: [ensureAuthenticated, applyOwnerId],
      update: [ensureAuthenticated, applyOwnerId]
    };

    this.after = { };
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

  create (data, params={}) {

    if (params.ownerId == null) {
      throw new errors.NotAuthenticated();
    }

    data = this._callData(data, params);

    return super.create(data, params);
  }

  update (id, data, params={}) {

    return super.update(id, data, params);
  }

  _callData (data, params) {
    return Object.assign({}, data, {ownerId: params.ownerId});
  }

}

module.exports = PlaylistService;
