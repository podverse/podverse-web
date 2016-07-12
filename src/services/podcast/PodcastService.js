
const SequelizeService = require('feathers-sequelize');

class PodcastService extends SequelizeService {

  constructor ({Models}={}) {
    super({Model: Models.Podcast});
    this.Models = Models;
  }

}

module.exports = PodcastService;
