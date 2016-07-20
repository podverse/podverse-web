const errors = require('feathers-errors');
const SequelizeService = require('feathers-sequelize').Service;
const {applyOwnerId, ensureAuthenticated} = require('hooks/common.js');


class ClipService extends SequelizeService {

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
    return super.create(data, params);
  }

  update (id, data, params={}) {

    return this.Models.MediaRef.findById(id)
      .then(mediaRef => {

        if (mediaRef.ownerId !== params.userId) {
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
