
const SequelizeService = require('feathers-sequelize').Service;

class PodcastService extends SequelizeService {

  constructor ({Models}={}) {
    super({Model: Models.Podcast});
    this.Models = Models;
  }

  // get(id, params) {
  //   return this.Model.findOne({
  //     where: {
  //         id:'id'
  //     }
  //   }).then(podcast => {
  //     return podcast
  //   }).catch(err => {
  //     return new errors.GeneralError(err);
  //   });
  // }

}

module.exports = PodcastService;
