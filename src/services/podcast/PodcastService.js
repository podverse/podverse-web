const
    SequelizeService = require('feathers-sequelize').Service,
    {locator} = require('locator.js'),
    errors = require('feathers-errors');

class PodcastService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');

    super({
      Model: Models.Podcast
    });
    this.Models = Models;
  }

  get (id, params={}) {
    const {Episode} = this.Models;

    // Retrieve podcast and its episode ids and titles only
    params.sequelize = {
      include: [{
        model: Episode,
        attributes: ['id', 'title', 'mediaURL']
      }]
    }

    return super.get(id, params);
  }

  find (params={}) {
    const {Episode} = this.Models;

    // Fuzzy match search for podcasts by title
    if (typeof params.query !== 'undefined' && typeof params.query.title !== 'undefined' && params.query.title.length > 0) {
      params.sequelize = {
        attributes: ['id', 'title'],
        where: {
          title: {
            $like: '%' + params.query.title + '%'
          }
        }
      }
    } else {
      throw new errors.GeneralError(`You must provide a search query.`)
    }

    return super.find(params);
  }

  // TODO:
  /*
  create podcast
  parse feed after created
  */

}

PodcastService.prototype.update = undefined;
PodcastService.prototype.remove = undefined;
PodcastService.prototype.patch = undefined;

module.exports = PodcastService;
