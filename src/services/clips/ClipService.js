const errors = require('feathers-errors');
const SequelizeService = require('feathers-sequelize').Service;

class PlaylistService extends SequelizeService {

  constructor ({Models}={}) {
    super({
      Model: Models.MediaRef
    });
    this.Models = Models;
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

    if(params.userId == null) {
      throw new errors.NotAuthenticated();
    }

    return super.create(data, params);
  }

  update (id, data, params={}) {

    return super.update(id, data, params);
  }

}

module.exports = PlaylistService;
