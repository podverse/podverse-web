const
    SequelizeService = require('feathers-sequelize').Service,
    {locator} = require('locator.js');

class PodcastService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');

    super({
      Model: Models.Podcast
    });
    this.Models = Models;

    // Hooks
    // -----
    this.before = {};

    this.after = {};

  }

  find (params={}) {
    const {Episode} = this.Models;

    params.sequelize = {
      include: [
        Episode
      ]
    };

    return super.find(params);
  }

}

module.exports = PodcastService;
