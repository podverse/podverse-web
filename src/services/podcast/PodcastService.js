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

  }

  find (params={}) {
    const {Episode} = this.Models;
    console.log(Episode);
    params.sequelize = {
      include: [{
        model: Episode,
        as: 'episodes'
      }]
    };

    return super.find(params);
  }

}

module.exports = PodcastService;
