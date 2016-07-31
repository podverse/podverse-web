const
    SequelizeService = require('feathers-sequelize').Service,
    {locator} = require('locator.js');

class PodcastService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');

    super({
      Model: Models.Podcast
    });
  }

}

module.exports = PodcastService;
