const
    SequelizeService = require('feathers-sequelize').Service,
    {locator} = require('locator.js'),
    errors = require('feathers-errors'),
    {ensureAuthenticated} = require('hooks/common.js');

class UserService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');

    super({
      Model: Models.User
    });
    this.Models = Models;

    // Hooks
    // -----
    this.before = {
      create: [ensureAuthenticated]
    };

    this.after = {};
  }

  create (data, params={}) {
    return this.Model.findOrCreate({
      where: {
        id: params.userId
      }
    })
    .then(user => {
      // TODO: I must be doing something wrong here. Basically I would like to do
      // getOrCreate so the returned object isn't in an array, but seems like that doesn't exist.
      return user[0];
    })
    .catch(e => {
      console.log(e);
      new errors.GeneralError(e);
    });
  }

}

UserService.prototype.get = undefined;
UserService.prototype.find = undefined;
UserService.prototype.update = undefined;
UserService.prototype.remove = undefined;
UserService.prototype.patch = undefined;

module.exports = UserService;
